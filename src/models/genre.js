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

genreSchema.methods.toApiRes = function () {
    return {
        id: this._id,
        name: this.name,
    };
};

const Genre = mongoose.model("Genre", genreSchema);

function validateGenreNew(genre) {
    const schema = Joi.object({
        name: Joi.string().min(6).max(64).required(),
    });

    return schema.validate(genre);
}

function validateGenreUpdate(genre) {
    const schema = Joi.object({
        name: Joi.string().min(6).max(64),
    });

    return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenreNew = validateGenreNew;
exports.validateGenreUpdate = validateGenreUpdate;
