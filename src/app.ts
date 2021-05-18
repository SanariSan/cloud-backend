import "reflect-metadata";
import express from "express";
import config from "config";
import { Logger } from "./core";
import { settings, routes, errorHandler } from "./loaders";
import { initializeDb, testUser } from "./initialization.database";
import { Connection } from "typeorm";
import { initializeMusic } from "./initializationMusic";

process.on("uncaughtException", (e: Error) => {
    console.log(false);
    Logger.warn(e);
});

async function init() {
    const connection: Connection = await initializeDb();
    await testUser(connection);
    await initializeMusic();

    const app = express();

    settings(app);
    routes(app);
    errorHandler(app);

    app.listen(config.get("port"), () => {
        Logger.warn(`server running on port : ${config.get("port")}`);
    }).on("error", (e: any) => {
        console.log(false);
        Logger.warn(e);
    });
}

init();
