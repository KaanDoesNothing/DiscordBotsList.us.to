const express = require("express");

const app = express.Router();

app.use("/all", require("./all"));

module.exports = app;