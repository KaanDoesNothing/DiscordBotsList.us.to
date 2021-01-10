const express = require("express");
const moment = require("moment");
const hat = require("hat");

const app = express.Router();

const db = require("../../../db");
const {commentSchema} = require("../../../schemas");
const {fixUser} = require("../../../utils");
const {isLoggedIn} = require("../../../modules/middlewares");

app.get("/:id", async (req, res) => {
    const comments = await db.get("comments").find({bot_id: req.params.id}, {sort: {commented: -1}});

    let fixedComments = await Promise.all(comments.map(async comment => {
        comment.author = await fixUser(comment.author_id);
        comment.readableCommentDate = moment(comment.commented).fromNow();

        return comment;
    }));

    return res.json({comments: fixedComments});
});

app.post("/:id", isLoggedIn, async (req, res) => {
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

module.exports = app;