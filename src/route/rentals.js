const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { validateRentalNew } = require("../model/rental");
const rentalService = require("../service/rentalService");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    try {
        const rentals = await rentalService.getAllRentals();
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

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const rental = await rentalService.getRentalById(req.params.id);
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

router.post("/", [auth, admin, validate(validateRentalNew)], async (req, res) => {
    try {
        const rental = await rentalService.createRental(req.body);
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
