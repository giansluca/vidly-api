const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const genreService = require("../service/genreService");
const { validateGenreNew, validateGenreUpdate } = require("../model/genre");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    try {
        const genres = await genreService.getAllGenres();
        res.send(genres);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const genre = await genreService.getGenreById(req.params.id);
        res.send(genre);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.post("/", [auth, admin, validate(validateGenreNew)], async (req, res) => {
    try {
        const id = await genreService.addNewGenre(req.body);
        res.status(201).send(id);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.put("/:id", [auth, admin, objectId, validate(validateGenreUpdate)], async (req, res) => {
    try {
        const genre = await genreService.updateGenre(req.params.id, req.body);
        res.send(genre);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    try {
        await genreService.deleteGenre(req.params.id);
        res.send();
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
