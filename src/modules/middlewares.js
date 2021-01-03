const { getUserPermissions } = require("../utils");
const db = require("../db");

let isLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        return res.json({error: "You must be logged in."});
    }else {
        return next();
    }
}

let isModerator = (req, res, next) => {
    let userID = req.session.user._id;

    if(res.locals.session.permissions.moderator) {
        return next();
    }else {
        return res.redirect("/");
    }
}

let isAllowedToEditBot = async (req, res, next) => {
    const finalBot = await db.get("bots").findOne({bot_id: req.params.id});

    let hasPermissions = false;
    
    if(res.locals.session && finalBot.owner_id === res.locals.session._id) {
        hasPermissions = true;

        return next();
    }

    return res.json({error: "Invalid permissions."});

    // next();
}

module.exports = {
    isLoggedIn,
    isModerator,
    isAllowedToEditBot
}