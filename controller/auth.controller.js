const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { ComparePassword, HashPassword } = require("../helper/passwd.helper");
const { getUserFromToken } = require("../helper/jwt.helper");
const { ResponseTemplate } = require("../helper/template.helper");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Sentry = require("@sentry/node");
require("dotenv").config();

const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

const listTokens = [];

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.MAIL_SMTP,
        pass: process.env.PASS_SMTP,
    },
});

async function Register(req, res, next) {
    const { id, email, password, name } = req.body;

    const hashPass = await HashPassword(password);

    // const payload = {
    //     name,
    //     email,
    //     password: hashPass,
    // };

    try {
        const checkUser = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        if (checkUser) {
            let respons = ResponseTemplate(
                null,
                "email already used",
                null,
                200,
            );
            res.status(200).json(respons);
            return;
        }

        await prisma.users.create({
            data: {
                email,
                password: hashPass,
                name,
            },
        });

        let respons = ResponseTemplate(null, "created success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        console.log(error);
        // Sentry.captureException(error);
        next(error);
    }
}

async function Login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            let respons = ResponseTemplate(null, "user not found", null, 200);
            res.status(200).json(respons);
            return;
        }

        let checkPassword = await ComparePassword(password, user.password);

        if (!checkPassword) {
            let respons = ResponseTemplate(
                null,
                "invalid email or password",
                "bad request",
                200,
            );
            res.status(200).json(respons);
            return;
        }

        let token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.SECRET_KEY,
        );
        // console.log(user)

        let respons = ResponseTemplate({ token }, "success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        Sentry.captureException(error);
        next(error);
    }
}

async function ForgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
        let resp = ResponseTemplate(null, "bad request", null, 200);
        res.json(resp);
        return;
    }

    const user = await prisma.users.findUnique({
        where: {
            email: email,
        },
    });

    if (!user) {
        let respons = ResponseTemplate(null, "user not found", null, 200);
        res.status(200).json(respons);
        return;
    }

    const payload = {};

    if (email) {
        payload.email = email;
    }

    try {
        const getTokenReset = jwt.sign(
            { id: user.id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "15m" },
        );

        const pathFrontend = "/resetpassword";
        const urlFrontend = `${req.protocol}://${process.env.HOST_DEPLOY}${pathFrontend}/${getTokenReset}`;

        // console.log(urlFrontend)

        const pathAPI = "/api/v1/auth/resetpassword";
        const urlAPI = `${req.protocol}://${req.get(
            "host",
        )}${pathAPI}/${getTokenReset}`;
        console.log(urlAPI);

        // async..await is not allowed in global scope, must use a wrapper
        // async function main() {
        //     // send mail with defined transport object
        //     const info = await transporter.sendMail({
        //         from: process.env.MAIL_SMTP, // sender address
        //         to: email, // list of receivers
        //         subject: "Forgot Password | Binar Academy ✔", // Subject line
        //         html: `
        //             <p><b>Please Verify with link bellow!</b> </p>
        //             <p><b>This token valid for 15 minutes!</b> </p>
        //             <p><a href='${urlFrontend}'>Click Here For Reset Password!</a></p>
        //         `, // html body
        //     });
        // }
        // main().catch(console.error);

        let respons = ResponseTemplate(null, "success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        Sentry.captureException(error);
        console.log(error);
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.json(resp);
        return;
    }
}

async function ResetPassword(req, res) {
    const { newPassword } = req.body;
    const token = req.params.token;
    const getEmail = [];

    if (!newPassword) {
        let resp = ResponseTemplate(null, "bad request", null, 400);
        res.json(resp);
        return;
    }

    try {
        // verifikasi token
        const verifyToken = await jwt.verify(
            token,
            process.env.SECRET_KEY,
            (err, decoded) => {
                if (err) {
                    let respons = ResponseTemplate(
                        null,
                        "token expired",
                        null,
                        401,
                    );
                    res.status(401).json(respons);
                    return;
                } else {
                    getEmail.push(decoded.email);
                }
            },
        );

        // dapatkan email
        const email = getEmail[0];

        // hashing password
        const hashPass = await HashPassword(newPassword);

        const users = await prisma.users.update({
            where: {
                email: String(email),
            },
            data: {
                password: hashPass,
            },
        });

        let respons = ResponseTemplate(null, "success", null, 200);
        res.status(200).json(respons);
        return;
    } catch (error) {
        Sentry.captureException(error);
        console.log(error);
        let resp = ResponseTemplate(null, "internal server error", error, 500);
        res.json(resp);
        return;
    }
}

function whoami(req, res) {
    // console.log(`listTokens dari whoami ${listTokens}`)
    let respons = ResponseTemplate({ user: req.user }, "success", null, 200);
    res.status(200).json(respons);
    return;
}

function logout(req, res) {
    const token = req.headers.authorization;
    if (token) {
        listTokens.push(token);
        res.status(200).json({ message: "Logout successful" });
    } else {
        res.status(400).json({ message: "Token not provided" });
    }
    return;
}

module.exports = {
    Register,
    Login,
    ForgotPassword,
    ResetPassword,
    whoami,
    logout,
    listTokens,
};
