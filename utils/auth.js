const router = require('express').Router();
const jwt = require('jsonwebtoken');
const joi = require('./joi');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { TOKEN_SECRET, TOKEN_EXPIRES } = require("../config");

// check user login and token state and set information into auth object
const auth = function (req, res, next) {
    var token = req.headers.token;
    try {
        // read payload
        var payload = jwt.verify(token, TOKEN_SECRET);
        // get user from payload
        var user = req.db.users.findOne({id: payload.id});
        if (!user) return res.status(401).send({error: "user not found"});

        // user to json method
        user.json = function () {
            return {
                ...user, meta: undefined, $loki: undefined, password: undefined
            };
        };

        // add user and token to req object
        req.token = token;
        req.user = user;

        next();
    } catch(_) {
        return res.status(400).send({
            error: 'invalid token'
        });
    }
}

// login route api
router.post("/login", joi.login, (req, res) => {
    // error message
    const sendError = () => res.status(400).send({error: "email or passward is wrong"});

    // check credentials
    const {joi} = req;
    if (joi.error) return sendError();

    // check if user exists
    var user = req.db.users.findOne({email: joi.value.email});
    if (!user) return sendError();

    // check user password
    var isValid = bcrypt.compareSync(joi.value.password, user.password);
    if (!isValid) return sendError();

    // create token
    var token = jwt.sign({
        id: user.id
    }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES });

    // send token
    res.send({
        ...req.db.users.code(user),
        token
    });
});

// register route api
router.post("/register", joi.register, (req, res) => {
    // check credentials
    const {joi} = req;
    if (joi.error) {
        var message = "password must be [a-z][A-Z][0-9] at least 6 chars";
        if (joi.error.path[0] !== "password") message = joi.error.message;
        return res.status(400).send({error: message});
    }

    // check if user exists
    var user = req.db.users.findOne({email: joi.value.email});
    if (user) res.status(400).send({error: "user with the same email exists"});

    // hash the password
    var password = joi.value.password;
    password = bcrypt.hashSync(password, 10);

    // create new user
    user = req.db.users.insert({
        id: uuid(), ...joi.value, password
    });

    console.log()

    req.db.save();

    res.send(req.db.users.code(user));
});

module.exports = {
    router,
    auth
}
