import express from "express";
import path from "path";
import "reflect-metadata";
import { Logger } from "./core";
import { initializeDb } from "./initialization.database";
import { errorHandlerServices, routersServices, settingsServices } from "./loaders/services";
import { errorHandler, routers, settings } from "./loaders/standart";

process.on("uncaughtException", (e: Error) => {
	console.log("Uncaught Exception");
	Logger.error(e);
});
process.on("unhandledRejection", (e: Error) => {
	console.log("Unhandled Rejection");
	Logger.error(e);
});

async function initializeApp() {
	await initializeDb({ dropDb: false });
	// await test();

	const app = express();

	settings(app);
	routers(app);
	// if (process.env.ENVIRONMENT === "development")
	routersServices(app);

	app.get("/*", (req, res) => {
		// res.sendFile("/home/me/Code/D/cloud-fullstack/cloud-front-build/index.html");
		res.sendFile(path.resolve("../", "cloud-front-build/index.html"));
	});

	errorHandler(app);

	app.listen(process.env.PORT, () => {
		Logger.warn(`server running on port : ${process.env.PORT}`);
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
		.listen(process.env.PORT_SERVICES, () => {
			Logger.warn(`server for services running on port : ${process.env.PORT_SERVICES}`);
		})
		.on("error", (e: any) => {
			console.log("App services listen handler");
			Logger.warn(e);
		});
}

async function init() {
	initializeApp();

	// if (process.env.ENVIRONMENT === "production") initializeAppServices();
}

init();
