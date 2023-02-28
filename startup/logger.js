const config = require("./config");
const winston = require("winston");

const logger = winston.createLogger();

const logFormat =
    config.env != "local"
        ? winston.format.json()
        : winston.format.combine(
              winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
              winston.format.colorize(),
              winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
          );

const console = new winston.transports.Console({
    level: "info",
    format: logFormat,
});

logger.add(console);

exports.logger = logger;
