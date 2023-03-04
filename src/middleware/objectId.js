const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    const id = req.params.id;

    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) return res.status(400).send(`Invalid id: ${id}`);

    next();
};
