const { logger } = require("../startup/logger");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const objectId = require("../middleware/objectId");
const { Customer, validateCustomerNew, validateCustomerUpdate } = require("../models/customer");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", [auth], async (req, res) => {
    try {
        const customers = await Customer.find().sort("name");

        customerListRes = customers.map((c) => {
            return { id: c._id, name: c.name, phone: c.phone, isGold: c.isGold };
        });
        res.send(customerListRes);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.get("/:id", [auth, objectId], async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).send(`Customer with id: ${id} was not found`);

        const customerRes = { id: customer._id, name: customer.name, phone: customer.phone, isGold: customer.isGold };
        res.send(customerRes);
    } catch (err) {
        logger.error(err);
        res.status(500).send(err);
    }
});

router.post("/", [auth, admin, validate(validateCustomerNew)], async (req, res) => {
    try {
        const customer = new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        });

        await customer.save();
        res.status(201).send(customer._id);
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

        const customerRes = { id: customer._id, name: customer.name, phone: customer.phone, isGold: customer.isGold };
        res.send(customerRes);
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
