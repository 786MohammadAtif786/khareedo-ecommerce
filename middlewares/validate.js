const Joi = require("joi");

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    address: Joi.string().allow("", null),
    mobile: Joi.string().pattern(/^[0-9]{10,15}$/).allow('', null),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user','admin','superAdmin').optional(),
});

const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required(),
});


const updateSchema = Joi.object({
name: Joi.string().min(2).max(100).optional(),
address: Joi.string().allow('', null),
mobile: Joi.string().pattern(/^[0-9]{10,15}$/).allow('', null),
});


const forgotPasswordSchema = Joi.object({
email: Joi.string().email().required(),
});


const resetPasswordSchema = Joi.object({
token: Joi.string().required(),
password: Joi.string().min(6).required(),
});


module.exports = {
    validateBody: (schema) => (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) return res.status(400).json({ message: 'Validation failed', details: error.details });
        req.body = value;
        next();
},
schemas: {
    registerSchema,
    loginSchema,
    updateSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    }
};