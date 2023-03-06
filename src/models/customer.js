const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 64,
        },
        phone: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 24,
        },
        isGold: {
            type: Boolean,
            required: true,
        },
    })
);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(6).max(64).required(),
        phone: Joi.string().min(6).max(24).required(),
        isGold: Joi.boolean(),
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
