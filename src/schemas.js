const Joi = require("joi");

let user_id = Joi.string().min(5).required();

const botSchema = Joi.object({
    bot_id: user_id,
    owner_id: user_id,
    short_description: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(500).required(),
    verified: Joi.boolean().required(),
    likes: Joi.number().required(),
    added: Joi.number().required(),
    invite_link: Joi.string().uri().required(),
    website_link: Joi.string().uri(),
    prefix: Joi.string().min(1).required()
});

const commentSchema = Joi.object({
    bot_id: user_id,
    author_id: user_id,
    comment_id: Joi.string().required(),
    content: Joi.string().min(1).max(100).required(),
    commented: Joi.number().required(),
    likes: Joi.number().required()
});

module.exports = {
    botSchema,
    commentSchema
}