const marked = require("marked");
const sanitizeHTML = require("sanitize-html");

const client = require("./client");
const config = require("./config");

module.exports.fixBot = async (bot) => {
    bot.user = client.users.cache.get(bot.bot_id) || await client.users.fetch(bot.bot_id);
    bot.owner = client.users.cache.get(bot.owner_id) || await client.users.fetch(bot.owner_id);

    bot._description = marked(bot.description);
    bot._description = sanitizeHTML(bot._description);

    if(bot._id) {
        delete bot._id;
    }

    if(bot.api_key) {
        delete bot._id;
    }
    
    return bot;
}

module.exports.fixUser = async (user_id) => {
    return client.users.cache.get(user_id) || await client.users.fetch(user_id);
}

module.exports.fixUserPermissions = (id) => {
    let member = client.guilds.cache.get(config.mainGuild).members.cache.get(id);

    if(member) {
        let permissions = {};

        permissions["moderator"] = member.roles.cache.has(config.roles[0]);

        return permissions;
    }else {
        return {};
    }
}

module.exports.isValidUserID = async (id) => {
    try {
        let user =  client.users.cache.get(id) || await client.users.fetch(id);

        return user;
    }catch(err) {
        return false
    }
}