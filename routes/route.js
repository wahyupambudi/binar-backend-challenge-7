const express = require("express");
const router = express.Router();
const authRoute = require('../routes/auth.route')
const morgan = require("morgan");

router.use(morgan("dev"));

router.use('/api/v1/auth', authRoute)

module.exports = router;
