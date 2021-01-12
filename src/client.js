const Discord = require("discord.js");
const { exec } = require("child_process");

const config = require("./config");
const db = require("./db");

const client = new Discord.Client();

client.on("ready", async () => {
    const guild = client.guilds.cache.get(config.mainGuild);
    const bots = await db.get("bots").find();

    bots.forEach(bot => {
        let botMember = guild.members.cache.get(bot.bot_id);
        let ownerMember = guild.members.cache.get(bot.owner_id);

        if(botMember) {
            if(!botMember.roles.cache.has(config.regularRoles.bots)) {
                botMember.roles.add(config.regularRoles.bots);
            }
        }

        if(ownerMember) {
            if(!ownerMember.roles.cache.has(config.regularRoles.botDevelopers)) {
                ownerMember.roles.add(config.regularRoles.botDevelopers);
            }
        }
    });
});

client.on("message", async (msg) => {
    if(msg.content === "!!forceUpdate") {
        const clientInfo = await client.fetchApplication();
        
        if(!msg.author.id !== clientInfo.owner.id) return;

        exec("npm run update");
    }
});

client.login(config.bot.token);

module.exports = client;