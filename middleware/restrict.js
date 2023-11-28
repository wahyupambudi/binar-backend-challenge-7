const { ResponseTemplate } = require("../helper/template.helper");
const jwt = require("jsonwebtoken");
const allListTokens = require('../controller/auth.controller').listTokens;

async function Authenticate(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        let respons = ResponseTemplate(null, "user unauthorized", null, 401);
        res.status(401).json(respons);
        return;
    }

    try {
        const user = await jwt.verify(authorization, process.env.SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        let respons = ResponseTemplate(null, "user unauthorized", error, 400);
        res.status(400).json(respons);
        return;
    }
}

async function restrictPostTodos(req, res, next) {
    const { authorization } = req.headers;
    const { email } = req.params;

    try {
        const user = await jwt.verify(authorization, process.env.SECRET_KEY);
        const idFromToken = user.id;
        const idFromBody = Number(req.body.userId);

        // console.log(idFromToken)
        // console.log(idFromBody)

        if (idFromToken !== idFromBody) {
            let respons = ResponseTemplate(
                null,
                "Forbidden: Access denied",
                error,
                400,
            );
            return res.status(400).json(respons);
            // console.log(req.params.email);
        }
        next();
    } catch (error) {
        let respons = ResponseTemplate(
            null,
            "Forbidden: Access denied",
            error,
            400,
        );
        res.status(400).json(respons);
        return;
    }
}

function checkTokenBlacklist(req, res, next) {
  const token = req.headers.authorization;
  // console.log(`ini token ${token}`)
  // console.log(`ini list token ${allListTokens}`)

  if (token && allListTokens.includes(token)) {
    return res.status(401).json({ message: 'Unauthorized. Token has been revoked.' });
  }

  next();
}

module.exports = {
    Authenticate,
    restrictPostTodos,
    checkTokenBlacklist
};
