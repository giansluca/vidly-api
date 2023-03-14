const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { validateCustomerNew, validateCustomerUpdate } = require("../model/customer");
const customerService = require("../service/customerService");
const express = require("express");
const router = express.Router();

router.get("/", [auth], async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.send(customers);
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
        const customer = await customerService.getCustomerById(req.params.id);
        res.send(customer);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.post("/", [auth, admin, validate(validateCustomerNew)], async (req, res) => {
    try {
        const id = await customerService.addNewCustomer(req.body);
        res.status(201).send(id);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.put("/:id", [auth, admin, objectId, validate(validateCustomerUpdate)], async (req, res) => {
    try {
        const customer = await customerService.updateCustomer(req.params.id, req.body);
        res.send(customer);
    } catch (err) {
        if (err.name === "ApiError") {
            res.status(err.statusCode).send(err.message);
        } else {
            logger.error(err);
            res.status(500).send(err.message);
        }
    }
});

router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    try {
        await customerService.deleteCustomer(req.params.id);
        res.send();
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
