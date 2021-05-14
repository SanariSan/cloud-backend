// import { initializeDbConnection } from "./src";
// initializeDbConnection();
import express from "express";
import config from "config";
import { Logger } from "./core";
import { settings, routes, errorHandler } from "./loaders";

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

process.on("uncaughtException", (e: Error) => {
    console.log(false);
    Logger.warn(e);
});
