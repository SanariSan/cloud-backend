import "reflect-metadata";
import express from "express";
import config from "config";
import { Logger } from "./core";
import { settings, routers, errorHandler } from "./loaders/standart";
import { routersServices, settingsServices, errorHandlerServices } from "./loaders/services";
import { initializeDb } from "./initialization.database";
import { test } from "./test.database";

process.on("uncaughtException", (e: Error) => {
	console.log("Uncaught Exception");
	Logger.error(e);
});
process.on("unhandledRejection", (e: Error) => {
	console.log("Unhandled Rejection");
	Logger.error(e);
});

async function initializeApp() {
	await initializeDb();
	// await test();

	const app = express();

	settings(app);
	routers(app);
	if (config.get("environment") === "development") routersServices(app);
	errorHandler(app);

	app.listen(config.get("port"), () => {
		Logger.warn(`server running on port : ${config.get("port")}`);
	}).on("error", (e: any) => {
		console.log("App listen handler");
		Logger.warn(e);
	});
}

async function initializeAppServices() {
	const appServices = express();

	settingsServices(appServices);
	routersServices(appServices);
	errorHandlerServices(appServices);

	appServices
		.listen(config.get("portServices"), () => {
			Logger.warn(`server for services running on port : ${config.get("portServices")}`);
		})
		.on("error", (e: any) => {
			console.log("App services listen handler");
			Logger.warn(e);
		});
}

async function init() {
	initializeApp();

	if (config.get("environment") === "production") initializeAppServices();
}

init();
