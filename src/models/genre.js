const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 64,
    },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(6).max(64).required(),
    });

    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
