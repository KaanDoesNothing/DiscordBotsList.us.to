const express = require("express");

const app = express.Router();

app.use("/bot", require("./bot/index"));

module.exports = app;