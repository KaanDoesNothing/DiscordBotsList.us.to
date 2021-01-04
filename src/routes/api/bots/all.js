const express = require("express");

const db = require("../../../db");
const {fixBot} = require("../../../utils");

const app = express.Router();

app.get("/json", async (req, res) => {
    let search = req.query.search;
    
    const bots = await db.get("bots").find({verified: true});
    let finalBots = await Promise.all(bots.map(async bot => {
        let fixedBot = await fixBot(bot);
        delete fixedBot.api_key

        return fixedBot;
    }));

    if(search && search.length > 0) {
        finalBots = finalBots.filter(bot => bot.user.username.startsWith(search));
    }

    return res.json({bots: finalBots});
});

module.exports = app;