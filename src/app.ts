// import { initializeDbConnection } from "./src";
// initializeDbConnection();
import express from "express";
import config from "config";
import { Logger } from "./helpers";
import { settings, routes, errorHandler } from "./loaders";

const app = express();

app.use(settings);
app.use(routes);
app.use(errorHandler);

app.listen(config.get("port"), () => {
    Logger.warn(`server running on port : ${config.get("port")}`);
}).on("error", (e: any) => {
    Logger.error(e);
});

process.on("uncaughtException", (e: Error) => {
    Logger.error(e);
});
