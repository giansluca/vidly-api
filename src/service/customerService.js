const { Customer } = require("../models/customer");

async function getAllCustomers() {
    const customers = await Customer.find().sort("name");
    return customers.map((c) => c.toApiRes());
}

async function getCustomerById(customerId) {
    const customer = await Customer.findById(customerId);
    if (!customer) return null;

    return customer.toApiRes();
}

async function addNewCustomer(bodyReq) {
    const customer = new Customer({
        name: bodyReq.name,
        phone: bodyReq.phone,
        isGold: bodyReq.isGold,
    });

    await customer.save();
    return customer._id;
}

exports.getAllCustomers = getAllCustomers;
exports.getCustomerById = getCustomerById;
exports.addNewCustomer = addNewCustomer;
