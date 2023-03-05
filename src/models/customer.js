const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 64,
        },
        phone: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 24,
        },
        isGold: {
            type: Boolean,
            default: false,
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
