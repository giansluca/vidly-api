const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validate = require("../middleware/validate");
const { Customer, validateCustomer } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    const customers = await Customer.find().sort("name");

    customerListRes = customers.map((c) => {
        return { id: c._id, name: c.name, phone: c.phone, isGold: c.isGold };
    });

    res.send(customerListRes);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("The customer with the given ID was not found");

    const customerRes = { id: customer._id, name: customer.name, phone: customer.phone, isGold: customer.isGold };
    res.send(customerRes);
});

router.post("/", [auth, validate(validateCustomer)], async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    });

    await customer.save();
    res.send(customer);
});

router.put("/:id", [auth, validate(validateCustomer)], async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold,
        },
        { new: true }
    );

    if (!customer) return res.status(404).send("The customer with the given ID was not found");

    res.send(customer);
});

router.delete("/:id", [auth, admin], async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send("The customer with the given ID was not found");

    res.send(customer);
});

module.exports = router;
