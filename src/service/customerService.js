const { Customer } = require("../models/customer");
const { ApiError } = require("../errors/apiError");

async function getAllCustomers() {
    const customers = await Customer.find().sort("name");
    return customers.map((c) => c.toApiRes());
}

async function getCustomerById(id) {
    const customer = await Customer.findById(id);
    if (!customer) throw new ApiError(`Customer with id: ${id} was not found`, 404);

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

async function updateCustomer(id, bodyReq) {
    const customer = await Customer.findByIdAndUpdate(
        id,
        {
            name: bodyReq.name,
            phone: bodyReq.phone,
            isGold: bodyReq.isGold,
        },
        { new: true }
    );
    if (!customer) throw new ApiError(`Customer with id: ${id} was not found`, 404);

    return customer.toApiRes();
}

async function deleteCustomer(id) {
    const customer = await Customer.findByIdAndRemove(id);
    if (!customer) throw new ApiError(`Customer with id: ${id} was not found`, 404);
}

module.exports = {
    getAllCustomers: getAllCustomers,
    getCustomerById: getCustomerById,
    addNewCustomer: addNewCustomer,
    updateCustomer: updateCustomer,
    deleteCustomer: deleteCustomer,
};
