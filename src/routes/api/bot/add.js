const express = require("express");

const app = express.Router();

const client = require("../../../client");
const db = require("../../../db");
const {botSchema} = require("../../../schemas");

app.post("/", async (req, res) => {
    let body = req.body;

    let finalBody = {...body, owner_id: res.locals.session._id, likes: 0, verified: false, added: Date.now()};

    const isValidated = botSchema.validate(finalBody);

    if(isValidated.error) {
        return res.json({error: isValidated.error.details[0].message});
    }

    try {
        let user = await client.users.fetch(finalBody.bot_id);

        if(user.bot !== true) {
            return res.json({error: "Bot_ID is not a bot."})
        }
    }catch(err) {
        return res.json({error: "Invalid bot id."});
    }

    let alreadyExists = await db.get("bots").findOne({bot_id: finalBody.bot_id});

    if(alreadyExists) return res.json({error: "Bot already exists."});

    db.get("bots").insert(finalBody).then(() => {
        sendBotAdded(finalBody.owner_id, finalBody.bot_id);
        return res.json({msg: "Your bot has been added."});
    }).catch(err => {
        return res.json({error: "Couldn't add the bot to the database."});
    });
});

module.exports = app;
