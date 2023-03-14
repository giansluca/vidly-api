const { Rental } = require("../model/rental");
const { Movie } = require("../model/movie");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send("Rental not found.");

    if (rental.dateReturned) return res.status(400).send("Return already processed.");

    rental.return();

    await rental.save();
    await Movie.updateOne({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

    return res.send(rental);
});

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.required(),
        movieId: Joi.required(),
    });

    return schema.validate(req);
}

module.exports = router;