const express = require("express");
const session = require("express-session");
const cors = require("cors");
const helmet = require("helmet");

const config = require("./config");
const client = require("./client");
const db = require("./db");
const {fixUserPermissions, fixBot} = require("./utils");
const app = express();

// app.use(helmet());
app.use(cors());
app.use(express.json({extended: true}));

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

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
    res.locals.regions = config.website.regions;

    next();
});

app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api/index"));

app.get("/forceUpdate/:password", async (req, res) => {
    if(!req.params.password !== config.password) return res.json({error: "...."}); 
});

app.use("/bot/:id", async (req, res) => {
    const bot = await db.get("bots").findOne({bot_id: req.params.id});
    const finalBot = await fixBot(bot);

    return res.render("bot-view", {client, bot: finalBot});
});

app.use((req, res) => {
    return res.render("main", {client});
});

app.listen(config.website.port || 4000);