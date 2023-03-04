const { logger } = require("../startup/logger");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

// login
router.post("/", async (req, res) => {
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
