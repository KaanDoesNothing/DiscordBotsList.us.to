const express = require("express");
const moment = require("moment");
const hat = require("hat");

const app = express.Router();

const db = require("../../../db");
const {likeSchema} = require("../../../schemas");
const {fixUser} = require("../../../utils");
const {isLoggedIn} = require("../../../modules/middlewares");

app.get("/:id", async (req, res) => {
    const likes = await db.get("likes").find({bot_id: req.params.id}, {sort: {date: -1}});

    return res.json({likes});
});

app.post("/:id", isLoggedIn, async (req, res) => {
    const bot_id = req.params.id;
    const author_id = res.locals.session._id;

    const hasAlreadyLiked = await db.get("likes").findOne({bot_id, author_id});
    
    if(hasAlreadyLiked) {
        return res.json({error: "You've already liked this bot before."});
    }

    db.get("likes").insert({bot_id, author_id, date: Date.now()}).then(() => {
        return res.json({msg: "Success."});
    }).catch(err => {
        return res.json({error: "An error occurred."});
    });
});

// app.post("/:id", isLoggedIn, async (req, res) => {
//     const {content} = req.body;

//     const finalContent = {bot_id: req.params.id, author_id: res.locals.session._id, comment_id: hat(), content: content, commented: Date.now(), likes: 0};
    
//     let isValid = commentSchema.validate(finalContent);

//     if(isValid.error) {
//         return res.json({error: isValid.error.details[0].message});
//     }

//     await db.get("comments").insert(finalContent).then(() => {
//         return res.json({msg: "Success."});
//     });
// });

module.exports = app;