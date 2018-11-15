const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require('morgan');
const db = require("./database/db");
const app = express();
const { PORT } = require("./config");


db((db) => {
    // log that database is read
    console.log("database is ready");

    // setup express app
    app.use(morgan("combined"));
    // app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    // inject db
    app.use((req, res, next) => {
        req.db = db;
        next();
    });

    // load routes
    app.use(require("./utils/auth").router);
    app.use("/todos", require("./api/todos"));
    app.use("/user", require("./api/users"));
    app.all('*', (req, res) => {
        res.status(404).send({error: "route not found"})
    });

    // start listening
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
});
