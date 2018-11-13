const loki = require("lokijs");

const db = new loki("database.db");

module.exports = function (cb) {
    db.loadDatabase({}, () => {

        // setup users collection
        var users = db.getCollection("users");
        if (!users) {
            users = db.addCollection("users");
        }
        users.code = user => {
            return {
                ...user, meta: undefined, $loki: undefined, password: undefined
            }
        }

        // setup todos collection
        var todos = db.getCollection("todos");
        if (!todos) todos = db.addCollection("todos");

        // save any changes
        db.saveDatabase();

        // call the callback function
        cb({
            db, users, todos, save: () => db.saveDatabase()
        });
    });
}
