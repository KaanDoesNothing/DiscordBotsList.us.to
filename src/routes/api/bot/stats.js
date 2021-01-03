const express = require("express");

const app = express.Router();

const db = require("../../../db");
const {botDataSchema} = require("../../../schemas");

app.get("/:id", async (req, res) => {
    let stats = await db.get("botsData").findOne({bot_id: req.params.id}, {sort: {date: -1}});

    if(stats) {
        delete stats._id;
        
        return res.json({stats});
    }else {
        return res.json({error: "No stats were found for the provided bot id."});
    }
});

app.post("/:id", async (req, res) => {
    let finalBody = {...req.body, bot_id: req.params.id, date: Date.now()};
    
    const isValid = botDataSchema.validate(finalBody);
    
    if(isValid.error) {
        return res.json({error: isValid.error.details[0].message});
    }

    const bot = await db.get("bots").findOne({bot_id: req.params.id});

    if(bot.api_key !== finalBody.api_key) {
        return res.json({error: "Invalid api key."});
    }

    delete finalBody.api_key;

    if(!bot) {
        return res.json({error: "Invalid bot id."});
    }

    db.get("botsData").insert(finalBody).then(() => {
        return res.json({msg: "Bot stats have been updated."});
    });
});

module.exports = app;