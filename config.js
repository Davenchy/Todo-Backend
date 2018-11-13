module.exports = {
    PORT: process.env.PORT || 3000,
    TOKEN_SECRET: "hello_world",
    TOKEN_EXPIRES: 60 * 60 // after one hour [s]
};
