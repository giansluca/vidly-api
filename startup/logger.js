const config = require("config");
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

const logger = winston.createLogger();

const file = new winston.transports.File({
  level: "error",
  filename: "./logs/logsfile.log",
  json: false,
  maxsize: 5242880, //5MB
  maxFiles: 5,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
});

const console = new winston.transports.Console({
  level: "info",
  json: false,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
});

/*
const mongo = new winston.transports.MongoDB({
  level: "error",
  db: config.get("dbUri"),
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});
*/

logger.add(console);

if (process.env.NODE_ENV == "production") {
  logger.add(file);
  //logger.add(mongo);
}

function loggerSetUp() {
  process.on("uncaughtException", (ex) => {
    logger.error(ex.stack, { metadata: ex });
    setTimeout(function () {
      process.exit(1);
    }, 2000);
  });

  process.on("unhandledRejection", (ex) => {
    logger.error(ex.stack, { metadata: ex });
    setTimeout(function () {
      process.exit(1);
    }, 2000);
  });
}

exports.logger = logger;
exports.loggerSetUp = loggerSetUp;
