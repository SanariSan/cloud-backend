import { routesV1 } from "../routes/index.js";
import express from "express";
const routes = express();
routes.use("/v1", routesV1);
// middleware.use((req, res, next) => next(new NotFoundError()));
routes.use((req, res, next) => next("not found error"));
routes.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).send(err.message);
});
export { routes };
