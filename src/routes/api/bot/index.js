const express = require("express");

const db = require("../../../db");
const {fixBot} = require("../../../utils");

const app = express.Router();

app.use("/stats", require("./stats"));
app.use("/comments", require("./comments"));

app.get("/:id", async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    let fixedBot = await fixBot(bot);
    
    delete fixedBot.api_key;

    return res.json({bot: fixedBot});
});

module.exports = app;