import fs from "fs";
import config from "config";
import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const environment = <string>config.get("environment");
const logLevel = environment === "development" ? "debug" : "warn";
const logDirectory = <string>config.get("logDirectory");

if (!fs.existsSync(<string>logDirectory)) {
    fs.mkdirSync(<string>logDirectory);
}

const fileLoggerOptions = {
    level: logLevel,
    dirname: logDirectory,
    filename: "%DATE%",
    extension: ".log",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    json: true,
    zippedArchive: true,
};

const exceptionsFileLogger = new DailyRotateFile({
    ...fileLoggerOptions,
    handleExceptions: true,
    filename: fileLoggerOptions.filename + ".exc",
});

const Logger = createLogger({
    format: format.combine(format.errors({ stack: true }), format.prettyPrint()),
    transports: [
        new transports.Console({
            level: logLevel,
        }),
        new DailyRotateFile({
            ...fileLoggerOptions,
            filename: fileLoggerOptions.filename + ".info",
        }),
    ],
    exceptionHandlers: [exceptionsFileLogger],
    exitOnError: false, // do not exit on handled exceptions
});

export { Logger };
