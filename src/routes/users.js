const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) return res.status(404).send(`User with id: ${id} was not found`);
        res.send(_.pick(user, ["name", "email", "isAdmin", "_id"]));
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.post("/", [validate(validateUser)], async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already registered");

        user = new User(_.pick(req.body, ["name", "email", "password"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.isAdmin = false;

        await user.save();

        const token = user.generateAuthToken();
        res.header("Authorization", token).send(_.pick(user, ["name", "email", "isAdmin", "_id"]));
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid email or password.");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).send("Invalid email or password.");

        const token = user.generateAuthToken();
        res.send(token);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
