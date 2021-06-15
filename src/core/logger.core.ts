import fs from "fs";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/*
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
*/

const logLevel = <string>process.env.NODE_ENV === "development" ? "debug" : "warn";
const logDirectory = <string>process.env.LOG_DIRECTORY;

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
