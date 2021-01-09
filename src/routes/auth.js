const express = require("express");
const authClient = require("../modules/authClient");
const {fixUserPermissions} = require("../utils");

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