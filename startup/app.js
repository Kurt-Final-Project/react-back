const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

app.use(cors());
app.use(
	helmet({
		crossOriginResourcePolicy: false,
	})
);
app.use(express.json());
app.use("/public", express.static("public"));

module.exports = app;
