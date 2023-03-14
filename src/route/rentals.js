const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Rental, validateRentalNew } = require("../model/rental");
const { Movie } = require("../model/movie");
const { Customer } = require("../model/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const rentals = await Rental.find().sort("-dateOut");
        res.send(rentals);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.get("/:id", async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id);

        if (!rental) return res.status(404).send("The rental with the given ID was not found.");

        res.send(rental);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.post("/", [auth, validate(validateRentalNew)], async (req, res) => {
    try {
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send("Invalid customer.");

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send("Invalid movie.");

        if (movie.numberInStock === 0) return res.status(400).send("Movie not in stock.");

        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone,
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate,
            },
        });

        await rental.save((err) => {
            if (err) return res.status(400).send(`Rental validation failed...\n${err}...`);
        });
        movie.numberInStock--;

        await movie.save((err) => {
            if (err) {
                const message = `Movie validation failed...\n${err}...\n`;
                return res.status(400).send(`${message} Rental canceled...`);
            }
            return res.status(200).send(rental);
        });

        res.send(rental);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

module.exports = router;
