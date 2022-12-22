const Joi = require("joi");

const schema = Joi.object({
    username: Joi.string().min(6).required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().min(6).required(),
    age: Joi.number().min(15).max(125).required()
});

module.exports = { schema };


