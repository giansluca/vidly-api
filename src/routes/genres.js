const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { Genre, validateGenreNew, validateGenreUpdate } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
});

router.get("/:id", [auth, objectId], async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);
});

router.post("/", [auth, admin, validate(validateGenreNew)], async (req, res) => {
    const genre = new Genre({
        name: req.body.name,
    });

    await genre.save();
    res.send(genre);
});

router.put("/:id", [auth, admin, objectId, validate(validateGenreUpdate)], async (req, res) => {
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

    if (!genre) return res.status(404).send("The genre with the given ID was not found");

    res.send(genre);
});

router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send("The genre with the given ID was not found");

    res.send();
});

module.exports = router;
