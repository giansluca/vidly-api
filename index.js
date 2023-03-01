const config = require("./startup/config");
const { logger } = require("./startup/logger");

const env = config.env;
logger.info(`Starting application on env ${env}`);

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if (env == "prod") {
    const compression = require("compression");
    const helmet = require("helmet");
    app.use(helmet());
    app.use(compression());

    logger.info("Using helmet and compression");
}

require("./startup/db")();
require("./startup/cors")(app);
require("./startup/routes")(app);
require("./startup/validation")();

const port = config.http.PORT;
const server = app.listen(port, () => {
    logger.info(`Listening on port ${port}...`);
});

module.exports = server;
