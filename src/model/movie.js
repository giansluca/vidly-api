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

movieSchema.methods.toApiRes = function () {
    return {
        id: this._id,
        title: this.title,
        genre: this.genre.toApiRes(),
        numberInStock: this.numberInStock,
        dailyRentalRate: this.dailyRentalRate,
    };
};

const Movie = mongoose.model("Movie", movieSchema);

function validateMovieNew(movie) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(256).required(),
        genreId: Joi.required(),
        numberInStock: Joi.number().min(0).max(1024).required(),
        dailyRentalRate: Joi.number().min(0).max(256).required(),
    });

    return schema.validate(movie);
}

function validateMovieUpdate(movie) {
    const schema = Joi.object({
        title: Joi.string().min(6).max(256),
        genreId: Joi.string().hex().length(24),
        numberInStock: Joi.number().min(0).max(1024),
        dailyRentalRate: Joi.number().min(0).max(256),
    });

    return schema.validate(movie);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovieNew = validateMovieNew;
exports.validateMovieUpdate = validateMovieUpdate;
