const express = require("express");

const app = express.Router();

const client = require("../../../client");
const db = require("../../../db");

const {isLoggedIn, isAllowedToEditBot} = require("../../../modules/middlewares");

app.get("/:id", isLoggedIn, isAllowedToEditBot, async (req, res) => {
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

module.exports = app;