import express from "express";
import { middleware, routes } from "./src/index.js";
// import { middleware, routes } from "./src";
import config from "config";
// import Logger from "./core/Logger";
// import { initializeDbConnection } from "./src";
// initializeDbConnection();

const app = express();

app.use(middleware);
app.use(routes);

app.listen(config.get("port"), () => {
    // app.listen(3001, () => {
    // Logger.info(`server running on port : ${config.get("port")}`);
    console.log(`server running on port : ${config.get("port")}`);
    // console.log(`server running on port : 3001`);
}).on("error", e => {
    console.log(e);
    //Logger.error(e)
});

// process.on("uncaughtException", e => {
// Logger.error(e);
// process.exit(1); !!
// });
