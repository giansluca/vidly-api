const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { validateMovieNew, validateMovieUpdate } = require("../model/movie");
const movieService = require("../service/movieService");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    try {
        const movies = await movieService.getAllMovies();
        res.send(movies);
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
        const movie = await movieService.getMovieById(req.params.id);
        res.send(movie);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.post("/", [auth, admin, validate(validateMovieNew)], async (req, res) => {
    try {
        const id = await movieService.addNewMovie(req.body);
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

router.put("/:id", [auth, admin, objectId, validate(validateMovieUpdate)], async (req, res) => {
    try {
        const movie = await movieService.updateMovie(req.params.id, req.body);
        res.send(movie);
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
        await movieService.deleteMovie(req.params.id);
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
