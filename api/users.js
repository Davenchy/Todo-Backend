const router = require("express").Router();
const auth = require('../utils/auth').auth;

router.get("/", auth, (req, res) => {
    res.send(req.user.json());
});

router.get("/list", auth, (req, res) => {
    res.send(req.db.users.find());
});

router.delete("/", auth, (req, res) => {
    const uid = req.user.id;
    req.db.todos.chain().find({owner: uid}).remove();
    req.db.users.remove(req.user);
    req.db.save();
    res.send();
});


module.exports = router;
