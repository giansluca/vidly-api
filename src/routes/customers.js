const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { Customer, validateCustomerNew, validateCustomerUpdate } = require("../models/customer");
const customerService = require("../service/customerService");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", [auth], async (req, res) => {
    try {
        const customers = await customerService.getAllCustomers();
        res.send(customers);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await customerService.getCustomerById(id);
        if (!customer) return res.status(404).send(`Customer with id: ${id} was not found`);

        res.send(customer);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.post("/", [auth, admin, validate(validateCustomerNew)], async (req, res) => {
    try {
        const id = await customerService.addNewCustomer(req.body);
        res.status(201).send(id);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.put("/:id", [auth, admin, objectId, validate(validateCustomerUpdate)], async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold,
            },
            { new: true }
        );

        if (!customer) return res.status(404).send(`Customer with id: ${id} was not found`);

        res.send(customer.toApiRes());
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.delete("/:id", [auth, admin, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findByIdAndRemove(id);

        if (!customer) return res.status(404).send(`Customer with id: ${id} was not found`);

        res.send();
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;
