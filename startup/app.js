const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const rateLimit = require("express-rate-limit");

// const limiter = rateLimit({
// 	windowMs: 1 * 60 * 1000, // 1 min
// 	max: 150,
// 	standardHeaders: true,
// 	legacyHeaders: false,
// });

// app.use(limiter);
app.use(cors());
app.use(
	helmet({
		crossOriginResourcePolicy: false,
	})
);
app.use(express.json());
app.use("/public", express.static("public"));

module.exports = app;
