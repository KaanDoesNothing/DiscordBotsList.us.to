const express = require("express");
const app = express.Router();

const db = require("../db");
const {fixBot, isValidUserID} = require("../utils");
const {isAllowedToEditBot} = require("../modules/middlewares")

app.get("/:id", async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    const finalBot = await fixBot(bot);

    let hasPermissions = false;

    if(res.locals.session) {
        if(finalBot.owner_id === res.locals.session._id) hasPermissions = true;
    }

    res.render("bot-view", {bot: finalBot, hasPermissions});
});

app.get("/:id/json", async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    const finalBot = await fixBot(bot);

    return res.json({bot: finalBot});
});

app.get("/:id/delete", isAllowedToEditBot, async (req, res) => {
    await db.get("bots").remove({bot_id: req.params.id});
});

app.post("/:id/update/prefix", isAllowedToEditBot, async (req, res) => {
    const {prefix } = req.body;

    if(prefix.length < 1) return res.json({error: "Invalid prefix"});

    await db.get("bots").findOneAndUpdate({bot_id: req.params.id}, {$set: {prefix}});

    return res.json({msg: "Prefix has been updated."});
});

module.exports = app;