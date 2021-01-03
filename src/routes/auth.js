const express = require("express");
const authClient = require("../modules/authClient");

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
    return res.json(req.session.user);
});

module.exports = app;