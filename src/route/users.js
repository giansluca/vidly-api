const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const objectId = require("../middleware/objectId");
const validate = require("../middleware/validate");
const { validateUser } = require("../model/user");
const userService = require("../service/userService");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/:id", [auth, admin, objectId], async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.send(_.pick(user, ["name", "email", "isAdmin", "_id"]));
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.post("/", [auth, admin, validate(validateUser)], async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.send(_.pick(user, ["name", "email", "isAdmin", "_id"]));
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.post("/login", async (req, res) => {
    try {
        const token = await userService.doLogin(req.body);
        res.header("Authorization", token).send();
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

module.exports = router;
