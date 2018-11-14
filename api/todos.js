const router = require("express").Router();
const auth = require("../utils/auth").auth;
const joi = require('../utils/joi');
const uuid = require('uuid');

// list all todos
router.get("/", auth, (req, res) => {
    const todos = req.db.todos.find({owner: req.user.id});
    res.send(todos);
});

// get todo with id
router.get("/:id", auth, (req, res) => {
    const todo = req.db.todos.findOne({owner: req.user.id, id: req.params.id});
    res.send(todo);
});

// create new todo
router.post("/", auth, joi.todo, (req, res) => {
    const {joi} = req;
    if (joi.error) return res.status(400).send({error: joi.error.message});
    var uid = req.user.id;
    var todo = req.db.todos.insert({
        ...joi.value, owner: uid, id: uuid()
    });
    req.db.save();
    res.send(todo);
});

// edit new todo
router.put("/:id", auth, joi.todo, (req, res) => {
    const {joi} = req;
    var uid = req.user.id;
    if (joi.error) return res.status(400).send({error: joi.error.message});
    const todo = req.db.todos.findOne({id: req.params.id, owner: uid});
    if (!todo) return res.status(404).send({error: "todo not found"});
    todo.body = joi.value.body;
    req.db.todos.update(todo);
    req.db.save();
    res.send(todo);
});

// delete todo with id
router.delete("/:id", auth, (req, res) => {
    const todo = req.db.todos.findOne({owner: req.user.id, id: req.params.id});
    if (!todo) return res.status(404).send({error: 'todo not found'});
    req.db.todos.remove(todo);
    req.db.save();
    res.send(todo);
});



module.exports = router;
