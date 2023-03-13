const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
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
});

customerSchema.methods.toApiRes = function () {
    return {
        id: this._id,
        name: this.name,
        phone: this.phone,
        isGold: this.isGold,
    };
};

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomerNew(customer) {
    const schema = Joi.object({
        name: Joi.string().min(6).max(64).required(),
        phone: Joi.string().min(6).max(24).required(),
        isGold: Joi.boolean().required(),
    });

    return schema.validate(customer);
}

function validateCustomerUpdate(customer) {
    const schema = Joi.object({
        name: Joi.string().min(6).max(64),
        phone: Joi.string().min(6).max(24),
        isGold: Joi.boolean(),
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomerNew = validateCustomerNew;
exports.validateCustomerUpdate = validateCustomerUpdate;
