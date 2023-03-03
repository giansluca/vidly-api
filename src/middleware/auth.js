const config = require("../startup/config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).send("Access denied, no token provided.");

    try {
        const decoded = jwt.verify(token, config.jwt.privateKey);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(400).send("Invalid Token.");
    }
};
