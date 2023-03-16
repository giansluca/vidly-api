const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const returnService = require("../service/returnService");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", [auth, admin, validate(validateReturn)], async (req, res) => {
    try {
        const rental = await returnService.doReturn(req.body.rentalId);
        return res.send(rental);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

function validateReturn(req) {
    const schema = Joi.object({
        rentalId: Joi.required(),
    });

    return schema.validate(req);
}

module.exports = router;
