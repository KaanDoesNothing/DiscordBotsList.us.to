const client = require("../client");
const config = require("../config");

let sendBotAdded = (owner_id, bot_id) => {
    let channel = client.channels.cache.get(config.channels.botLogs);

    channel.send(`<@&${config.roles[1]}>, <@${owner_id}> has added <@${bot_id}>`);
}

let sendBotAccepted = (moderator_id, bot_id) => {
    let channel = client.channels.cache.get(config.channels.botLogs);

    channel.send(`<@${bot_id}> Has been verified by <@${moderator_id}>`);
}

let sendBotDeclined = (moderator_id, bot_id) => {
    let channel = client.channels.cache.get(config.channels.botLogs);

    channel.send(`<@${bot_id}> Has been declined by <@${moderator_id}>`);
}

module.exports.sendBotAdded = sendBotAdded;
module.exports.sendBotAccepted = sendBotAccepted;
module.exports.sendBotDeclined = sendBotDeclined;