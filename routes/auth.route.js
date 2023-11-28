const express = require("express");
const router = express.Router();
const { Register, Login, ForgotPassword, ResetPassword, whoami, logout } = require("../controller/auth.controller");
const { Authenticate, checkTokenBlacklist } = require("../middleware/restrict");

router.post("/register", Register);

router.post("/login", Login);

router.post("/forgotpassword", ForgotPassword);

router.post("/resetpassword/:token", ResetPassword);

router.get("/whoami", Authenticate, checkTokenBlacklist, whoami);

router.post("/logout", Authenticate, logout);

module.exports = router;
