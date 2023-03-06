const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        maxLength: 256,
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1024,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 256,
    },
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(256).required(),
        genreId: Joi.required(),
        numberInStock: Joi.number().min(0).max(1024).required(),
        dailyRentalRate: Joi.number().min(0).max(256).required(),
    });

    return schema.validate(movie);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovie = validateMovie;
