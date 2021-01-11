const express = require("express");
const hat = require("hat");
const authClient = require("../modules/authClient");
const {fixUserPermissions} = require("../utils");
const db = require("../db");

const app = express.Router();

app.get("/callback", async (req, res) => {
    try {
        const {code} = req.query;
        const key = await authClient.getAccess(code);

        const user = await authClient.getUser(key);

        req.session.user = user;
        req.session.key = key;
        req.session.save();

        res.redirect("/");
    }catch(err) {
        console.log(err);
        res.render("error", {error: err});
    }
});

app.post("/callback", async (req, res) => {
    try {
        const {code} = req.body;
        const key = await authClient.getAccess(code);

        const user = await authClient.getUser(key);

        req.session.user = user;
        req.session.key = key;
        req.session.save();

        return res.json({msg: "Success."});
    }catch(err) {
        return res.json({error: "Invalid code."});
    }
});

// app.post("/callback", async (req, res) => {
//     try {
//         const {code} = req.body;
//         const key = await authClient.getAccess(code);

//         const user = await authClient.getUser(key);

//         let userData = await db.get("users").findOne({user_id: user._id});

//         if(!userData) {
//             await db.get("users").insert({user_id: user._id, api_key: hat(), added: Date.now()});

//             userData = await db.get("users").findOne({user_id: user._id});
//         }

//         userData.user = user;

//         return res.json({user: userData});
//     }catch(err) {
//         return res.json({error: "Invalid code."});
//     }
// });

app.get("/login", (req, res) => {
    res.redirect(authClient.authCodeLink);
});

app.get("/session", (req, res) => {
    let user = req.session.user;

    if(user) {
        user = user;

       user.permissions = fixUserPermissions(user._id);

       return res.json({session: user});
    }else {
        return res.json({error: "Not logged in."});
    }
});

module.exports = app;