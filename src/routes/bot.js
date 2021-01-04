const express = require("express");
const hat = require("hat");
const moment = require("moment");
const app = express.Router();

const db = require("../db");
const {fixBot, fixUser, isValidUserID} = require("../utils");
const {isAllowedToEditBot, isLoggedIn} = require("../modules/middlewares")
const {commentSchema, botDataSchema} = require("../schemas");

app.get("/:id", async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    const finalBot = await fixBot(bot);

    let hasPermissions = false;

    if(res.locals.session) {
        if(finalBot.owner_id === res.locals.session._id) hasPermissions = true;
    }

    res.render("bot-view", {bot: finalBot, hasPermissions});
});

app.get("/:id/edit", isLoggedIn, isAllowedToEditBot, async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    const finalBot = await fixBot(bot);

    let hasPermissions = false;

    if(res.locals.session) {
        if(finalBot.owner_id === res.locals.session._id) hasPermissions = true;
    }

    res.render("bot-edit", {bot: finalBot, hasPermissions});
});

app.get("/:id/delete", isAllowedToEditBot, async (req, res) => {
    await db.get("bots").remove({bot_id: req.params.id});
});

app.get("/:id/apikey", isLoggedIn, isAllowedToEditBot, async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});

    if(!bot) {
        return res.json({error: "Invalid bot id."});
    }

    let apiKey = bot.api_key;

    if(!apiKey) {
        apiKey = hat();
        await db.get("bots").findOneAndUpdate({bot_id: req.params.id}, {$set: {api_key: apiKey}});
    }

    return res.json({api_key: apiKey});
});

app.post("/:id/update/prefix", isAllowedToEditBot, async (req, res) => {
    const {prefix } = req.body;

    if(prefix.length < 1) return res.json({error: "Invalid prefix"});

    await db.get("bots").findOneAndUpdate({bot_id: req.params.id}, {$set: {prefix}});

    return res.json({msg: "Prefix has been updated."});
});

module.exports = app;