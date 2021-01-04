const express = require("express");

const app = express.Router();

app.use("/bot", require("./bot/index"));
app.use("/bots", require("./bots/index"));

module.exports = app;