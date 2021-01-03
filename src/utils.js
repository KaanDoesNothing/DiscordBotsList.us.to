const client = require("./client");
const config = require("./config");

module.exports.fixBot = async (bot) => {
    bot.user = client.users.cache.get(bot.bot_id) || await client.users.fetch(bot.bot_id);
    bot.owner = client.users.cache.get(bot.owner_id) || await client.users.fetch(bot.owner_id);
    
    return bot;
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