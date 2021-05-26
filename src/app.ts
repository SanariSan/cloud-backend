import "reflect-metadata";
import express from "express";
import config from "config";
import { Logger } from "./core";
import { settings, routes, errorHandler } from "./loaders";
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

async function init() {
    await initializeDb();
    await test();

    console.log("initialized");

    const app = express();
    settings(app);
    routes(app);
    errorHandler(app);

    app.listen(config.get("port"), () => {
        Logger.warn(`server running on port : ${config.get("port")}`);
    }).on("error", (e: any) => {
        console.log("App listen handler");
        Logger.warn(e);
    });
}

init();
