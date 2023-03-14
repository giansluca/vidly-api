const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 6,
                maxLength: 64,
            },
            isGold: {
                type: Boolean,
                required: true,
            },
            phone: {
                type: String,
                required: true,
                minLength: 6,
                maxLength: 24,
            },
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minLength: 6,
                maxLength: 256,
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 256,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        "customer._id": customerId,
        "movie._id": movieId,
    });
};

rentalSchema.methods.return = function () {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, "days");
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.required(),
        movieId: Joi.required(),
    });

    return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;