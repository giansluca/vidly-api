const config = require("./config");
const mongoose = require("mongoose");
const { logger } = require("./logger");

module.exports = () => {
    const dbUrl = config.db.mongoUrl;

    mongoose.connect(dbUrl).then(
        () => logger.info(`Connected to -> ${dbUrl}`),
        (err) => logger.error("Error connecting to database")
    );
};
