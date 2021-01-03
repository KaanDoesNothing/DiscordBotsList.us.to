const express = require("express");

const app = express.Router();

app.use("/stats", require("./stats"));

module.exports = app;