const express = require("express");
const hat = require("hat");
const moment = require("moment");
const app = express.Router();

const db = require("../db");
const {fixBot, fixUser, isValidUserID} = require("../utils");
const {isAllowedToEditBot, isLoggedIn} = require("../modules/middlewares")
const {commentSchema} = require("../schemas");

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

    return res.json({bot: fixedBot, comments: fixedComments});
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

app.post("/:id/update/prefix", isAllowedToEditBot, async (req, res) => {
    const {prefix } = req.body;

    if(prefix.length < 1) return res.json({error: "Invalid prefix"});

    await db.get("bots").findOneAndUpdate({bot_id: req.params.id}, {$set: {prefix}});

    return res.json({msg: "Prefix has been updated."});
});

module.exports = app;