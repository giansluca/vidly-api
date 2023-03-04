const config = require("./config");
const winston = require("winston");

const logFormatter = winston.format.printf((info) => {
    let { timestamp, level, stack, message } = info;
    message = stack || message;
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.errors({ stack: true }),
});

const logFormat =
    config.env != "local"
        ? winston.format.json()
        : winston.format.combine(
              winston.format.simple(),
              winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
              winston.format.colorize(),
              logFormatter
          );

const console = new winston.transports.Console({
    format: logFormat,
});

logger.add(console);

exports.logger = logger;
