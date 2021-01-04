const express = require("express");

const app = express.Router();

const db = require("../../../db");
const {editBotSchema} = require("../../../schemas");
const {isLoggedIn, isAllowedToEditBot} = require("../../../modules/middlewares");

app.get("/:id", isLoggedIn, isAllowedToEditBot, async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    
    return res.json({description: bot.description, short_description: bot.short_description, prefix: bot.prefix, invite_link: bot.invite_link, website_link: bot.website_link});
});

app.post("/:id", isLoggedIn, isAllowedToEditBot, async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    
    if(!bot) {
        return res.json({error: "Invalid bot id."});
    }

    const body = req.body;

    const isValid = editBotSchema.validate(body);

    if(isValid.error) {
        return res.json({error: isValid.error.details[0].message});
    }

    db.get("bots").findOneAndUpdate({bot_id: req.params.id}, {$set: body}).then(() => {
        return res.json({msg: "Bot has been updated."});
    });
});

module.exports = app;