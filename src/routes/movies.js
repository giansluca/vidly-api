const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { Movie, validateMovieNew, validateMovieUpdate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    try {
        const movies = await Movie.find().sort("name");
        res.send(movies.map((m) => m.toApiRes()));
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findById(id);

        if (!movie) return res.status(404).send(`Movie with id: ${id} was not found`);

        res.send(movie.toApiRes());
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.post("/", [auth, admin, validate(validateMovieNew)], async (req, res) => {
    try {
        const genreId = req.body.genreId;
        const isValidGenreId = mongoose.isValidObjectId(genreId);
        if (!isValidGenreId) return res.status(400).send(`Invalid genreId: ${genreId}`);

        const genre = await Genre.findById(genreId);
        if (!genre) return res.status(404).send("Invalid genre");

        const movie = new Movie({
            title: req.body.title,
            genre: genre.toApiReq(),
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate,
        });

        await movie.save();
        res.status(201).send(movie._id);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.put("/:id", [auth, admin, objectId, validate(validateMovieUpdate)], async (req, res) => {
    try {
        let genre;
        const genreId = req.body.genreId;
        if (genreId) {
            const isValidGenreId = mongoose.isValidObjectId(genreId);
            if (!isValidGenreId) return res.status(400).send(`Invalid genreId: ${genreId}`);

            genre = await Genre.findById(req.body.genreId);
            if (!genre) return res.status(404).send("Invalid genre");
        }

        const id = req.params.id;
        const movie = await Movie.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                genre: genre != undefined ? genre.toApiReq() : genre,
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate,
            },
            { new: true }
        );

        if (!movie) return res.status(404).send(`Movie with id: ${id} was not found`);

        res.send(movie.toApiRes());
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const movie = await Movie.findByIdAndRemove(id);

        if (!movie) return res.status(404).send(`Movie with id: ${id} was not found`);

        res.send();
    } catch (err) {
        logger.error(err);
        res.status(500).send(err.message);
    }
});

module.exports = router;
