console.dir(process.env, { depth: 5 });

import express from "express";
import path from "path";
import "reflect-metadata";
import { Logger } from "./core";
import { initializeDb } from "./initialization.database";
import { errorHandler, routers, settings } from "./loaders/";

process.on("uncaughtException", (e: Error) => {
	Logger.error("Uncaught Exception");
	Logger.error(e);
});
process.on("unhandledRejection", (e: Error) => {
	Logger.error("Unhandled Rejection");
	Logger.error(e);
});

async function initializeApp() {
	await initializeDb();

	const app = express();

	settings(app);
	routers(app);
	errorHandler(app);

	if (process.env.NODE_ENV === "production") {
		app.get("/*", (req, res) => {
			res.sendFile(path.resolve("./", "cloud-front-build/index.html"));
		});
	}

	app.listen(Number(process.env.PORT), String(process.env.HOST), () => {
		Logger.warn(`server running on port : ${process.env.PORT}`);
	}).on("error", (e: any) => {
		Logger.warn(e);
	});
}

function init() {
	initializeApp();
}

init();
