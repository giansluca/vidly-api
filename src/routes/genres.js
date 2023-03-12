const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { Genre, validateGenreNew, validateGenreUpdate } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    try {
        const genres = await Genre.find().sort("name");

        res.send(genres.map((g) => g.toApiRes()));
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const genre = await Genre.findById(id);

        if (!genre) return res.status(404).send(`Genre with id: ${id} was not found`);

        res.send(genre.toApiRes());
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.post("/", [auth, admin, validate(validateGenreNew)], async (req, res) => {
    try {
        const genre = new Genre({
            name: req.body.name,
        });

        await genre.save();
        res.status(201).send(genre._id);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.put("/:id", [auth, admin, objectId, validate(validateGenreUpdate)], async (req, res) => {
    try {
        const id = req.params.id;
        const genre = await Genre.findByIdAndUpdate(id, { name: req.body.name }, { new: true });

        if (!genre) return res.status(404).send(`Genre with id: ${id} was not found`);

        res.send(genre.toApiRes());
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const genre = await Genre.findByIdAndRemove(id);

        if (!genre) return res.status(404).send(`Genre with id: ${id} was not found`);

        res.send();
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
