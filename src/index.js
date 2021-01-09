const express = require("express");
const session = require("express-session");
const cookies = require("cookies");

const config = require("./config");
const client = require("./client");
const {fixBot, fixUserPermissions} = require("./utils");
const {isLoggedIn, isModerator} = require("./modules/middlewares");
const {botSchema} = require("./schemas");
const {sendBotAdded} = require("./modules/botActions");
const db = require("./db");

const app = express();

app.use(express.json({extended: true}));

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(cookies.express(["a", "b", "c"]));

app.set("view engine", "pug");

app.use("/static", express.static("public"));

if(config.website.cache) {
    app.set("view cache", true)
}

app.use((req, res, next) => {
    const user = req.session.user;

    if(user) {
        res.locals.session = user;

        res.locals.session.permissions = fixUserPermissions(user._id);
    }

    res.locals.query = req.query;
    res.locals.params = req.params;
    res.locals.darkMode = req.session.darkMode;

    next();
});

app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api/index"));

app.get("/switch_theme", async (req, res) => {
    req.session.darkMode = !req.session.darkMode;
    req.session.save();
    res.redirect("/");
});

app.use((req, res) => {
    return res.render("client", {client});
});

app.listen(config.website.port || 4000);