const express = require("express");
const app = express.Router();

const db = require("../db");
const {fixBot, isValidUserID} = require("../utils");
const {sendBotAccepted, sendBotDeclined} = require("../modules/botActions");

app.get("/", async (req, res) => {
    res.render("admin");
});

app.get("/bots/json", async (req, res) => {
    let search = req.query.search;
    
    const bots = await db.get("bots").find({verified: false});
    let finalBots = await Promise.all(bots.map(bot => fixBot(bot)));

    if(search && search.length > 0) {
        finalBots = finalBots.filter(bot => bot.user.username.startsWith(search));
    }

    res.json({bots: finalBots, search});
});

app.get("/bots/:id/accept", async (req, res) => {
    let {id} = req.params;

    const isValid = await isValidUserID(id);

    if(isValid) {
        db.get("bots").findOneAndUpdate({bot_id: id}, { $set: { verified: true} }).then(() => {
            sendBotAccepted(res.locals.session._id, id);
            return res.json({msg: "Bot has been verified."});
        });
    }else {
        return res.json({error: "invalid bot id."});
    }
});

app.get("/bots/:id/decline", async (req, res) => {
    let {id} = req.params;

    const isValid = await isValidUserID(id);

    if(isValid) {
        db.get("bots").remove({bot_id: id, verified: false}).then(() => {
            sendBotDeclined(res.locals.session._id, id);
            return res.json({msg: "Bot has been declined."});
        });
    }else {
        return res.json({error: "invalid bot id."});
    }
});


module.exports = app;