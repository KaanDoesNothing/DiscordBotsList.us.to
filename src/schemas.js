const Joi = require("joi");

const botSchema = Joi.object({
    bot_id: Joi.string().min(5).required(),
    owner_id: Joi.string().min(5).required(),
    short_description: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(500).required(),
    verified: Joi.boolean().required(),
    likes: Joi.number().required(),
    added: Joi.number().required(),
    invite_link: Joi.string().uri().required(),
    website_link: Joi.string().uri(),
    prefix: Joi.string().min(1).required()
});

module.exports = {
    botSchema
}