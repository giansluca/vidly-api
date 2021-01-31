const mongoose = require("mongoose");
const config = require("config");
const { logger } = require("./logger");

module.exports = () => {
  const db = config.get("dbUri");

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => logger.info(`Connected to ${db} ...`));
};
