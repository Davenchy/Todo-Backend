const joi = require('joi');

// check register credentials
module.exports.register = function (req, res, next) {
    const {error, value} = joi.validate(req.body, {
        name: joi.string().alphanum().min(3).max(10).required(),
        email: joi.string().email().required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required()
    });
    req.joi = { value, error: (error)? error.details[0] : null };
    next();
};

// check login credentials
module.exports.login = function (req, res, next) {
    const {error, value} = joi.validate(req.body, {
        email: joi.string().email().required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
    });
    req.joi = { value, error: (error)? error.details[0] : null };
    next();
};

// check new todo credentials
module.exports.todo = function (req, res, next) {
    const {error, value} = joi.validate(req.body, {
        body: joi.string().required()
    });
    req.joi = { value, error: (error)? error.details[0] : null };
    next();
};
