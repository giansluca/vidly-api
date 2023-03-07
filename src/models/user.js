const config = require("../startup/config");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 256,
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 64,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 64,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.jwt.privateKey, { expiresIn: "1h" });
    return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(64).required(),
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
