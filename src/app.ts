// import Logger from "./core/Logger";
// import { initializeDbConnection } from "./src";
// initializeDbConnection();
import express from "express";
import { middleware, routes } from "./loaders";
import config from "config";

const app = express();

app.use(middleware);
app.use(routes);

app.listen(config.get("port"), () => {
    console.log(`server running on port : ${config.get("port")}`);
}).on("error", (e: any) => {
    console.log(e);
});

// process.on("uncaughtException", e => {
// Logger.error(e);
// process.exit(1); !!
// });
