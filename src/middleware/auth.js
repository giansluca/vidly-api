const config = require("../startup/config");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const bearerToken = req.header("Authorization");
    if (!bearerToken) return res.status(401).send("Access denied, no token provided.");

    const token = bearerToken.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, config.jwt.privateKey);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(400).send("Invalid Token.");
    }
};
