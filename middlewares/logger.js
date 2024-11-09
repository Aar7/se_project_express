const winston = require("winston");
const expressWinston = require("express-winston");

// Logging requests to the server and the errors that can occur on it using the logger () method of the expressWinston module

// custom formatter
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta.error?.stack || message}`
  )
);

// request logger
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "request.log",
      format: winston.format.json(),
    }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      format: messageFormat,
    }),
    new winston.transports.File({
      filename: "error.log",
      format: winston.format.json(),
    }),
  ],
});

module.exports = { requestLogger, errorLogger };
