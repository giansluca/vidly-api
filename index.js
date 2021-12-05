const config = require("config");
const debug = require("debug")("app:startup");
const morgan = require("morgan");
const express = require("express");
const { logger, loggerSetUp } = require("./startup/logger");

loggerSetUp();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

require("./startup/db")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

if (app.get("env") == "development") {
  app.use(morgan("dev"));
  debug(config.get("name"));
  debug("Morgan enabled...");
}

// Server start
const port = process.env.PORT || config.get("port");
const server = app.listen(port, () => {
  logger.info(config.get("name"));
  logger.info(`Listening on port ${port}...`);
});

module.exports = server;
