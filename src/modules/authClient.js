const OAuthClient = require("disco-oauth");
const config = require("../config");

const client = new OAuthClient(config.bot.id, config.bot.secret);
client.setRedirect(`${config.website.baseURL}/`);
client.setScopes("identify");

module.exports = client;