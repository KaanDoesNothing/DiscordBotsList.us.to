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

app.get("/:id/json", async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    let fixedBot = await fixBot(bot);

    const comments = await db.get("comments").find({bot_id: req.params.id}, {sort: {commented: -1}});
    let fixedComments = await Promise.all(comments.map(async comment => {
        comment.author = await fixUser(comment.author_id);
        comment.readableCommentDate = moment(comment.commented).fromNow();

        return comment;
    }));

    let stats = await db.get("botsData").findOne({bot_id: bot.bot_id}, {sort: {date: -1}});

    if(stats) delete stats._id;

    return res.json({bot: fixedBot, comments: fixedComments, stats});
});

app.get("/:id/delete", isAllowedToEditBot, async (req, res) => {
    await db.get("bots").remove({bot_id: req.params.id});
});

app.post("/:id/comment", isLoggedIn, async (req, res) => {
    const {content} = req.body;

    const finalContent = {bot_id: req.params.id, author_id: res.locals.session._id, comment_id: hat(), content: content, commented: Date.now(), likes: 0};
    
    let isValid = commentSchema.validate(finalContent);

    if(isValid.error) {
        return res.json({error: isValid.error.details[0].message});
    }

    await db.get("comments").insert(finalContent).then(() => {
        return res.json({msg: "Success."});
    });
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

app.post("/:id/stats", async (req, res) => {
    let finalBody = {...req.body, bot_id: req.params.id, date: Date.now()};
    
    const isValid = botDataSchema.validate(finalBody);
    
    if(isValid.error) {
        return res.json({error: isValid.error.details[0].message});
    }

    delete finalBody.api_key;

    const bot = await db.get("bots").findOne({bot_id: req.params.id});

    if(!bot) {
        return res.json({error: "Invalid bot id."});
    }

    db.get("botsData").insert(finalBody).then(() => {
        return res.json({msg: "Bot stats have been updated."});
    });
});

app.post("/:id/update/prefix", isAllowedToEditBot, async (req, res) => {
    const {prefix } = req.body;

    if(prefix.length < 1) return res.json({error: "Invalid prefix"});

    await db.get("bots").findOneAndUpdate({bot_id: req.params.id}, {$set: {prefix}});

    return res.json({msg: "Prefix has been updated."});
});

module.exports = app;