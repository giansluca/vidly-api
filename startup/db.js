const config = require("./config");
const mongoose = require("mongoose");
const { logger } = require("./logger");

module.exports = () => {
    const db = config.db.mongoUrl;

    mongoose
        .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => logger.info(`Connected to ${db} ...`));
};
