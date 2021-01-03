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
    res.locals.darkMode = req.session.darkMode;

    next();
});

app.use("/auth", require("./routes/auth"));
app.use("/admin", isLoggedIn, isModerator, require("./routes/admin"));
app.use("/bot", require("./routes/bot"));

app.get("/", async (req, res) => {
    let search = req.query.search;
    
    const bots = await db.get("bots").find({verified: true}, {sort: {added: -1}});
    let finalBots = await Promise.all(bots.map(bot => fixBot(bot)));

    if(search && search.length > 0) {
        finalBots = finalBots.filter(bot => bot.user.username.startsWith(search));
    }

    res.render("home", {bots: finalBots, search});
});

app.get("/bots/json", async (req, res) => {
    let search = req.query.search;
    
    const bots = await db.get("bots").find({verified: true});
    let finalBots = await Promise.all(bots.map(bot => fixBot(bot)));

    if(search && search.length > 0) {
        finalBots = finalBots.filter(bot => bot.user.username.startsWith(search));
    }

    return res.json({bots});
});

app.get("/enabledarkmode", async (req, res) => {
    req.session.darkMode = true;
    req.session.save();
    res.redirect("/");
});

app.get("/add", isLoggedIn, (req, res) => {
    res.render("add");
});

app.post("/add", isLoggedIn, async (req, res) => {
    let body = req.body;

    let finalBody = {...body, owner_id: res.locals.session._id, likes: 0, verified: false, added: Date.now()};

    const isValidated = botSchema.validate(finalBody);

    if(isValidated.error) {
        return res.json({error: isValidated.error.details[0].message});
    }

    try {
        await client.users.fetch(finalBody.bot_id);
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

app.get("/test", (req, res) => {
    res.render("test/index");
});

app.get("/test1", (req, res) => {
    res.render("test/index");
});

app.listen(config.website.port || 4000);