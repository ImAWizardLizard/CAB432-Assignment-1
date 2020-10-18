const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const interwhatRouter = require("./routes/interwhat");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", express.static("public")); // Return react frontend
app.use("/", interwhatRouter); // Endpoint for the API

module.exports = app;
