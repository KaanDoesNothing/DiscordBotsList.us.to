const monk = require("monk");
const config = require("./config");

const db = monk(config.databaseURL);

module.exports = db;