import { routesV1 } from "../routes";
import express, { Request, Response, NextFunction } from "express";

const routes = express();
routes.use("/v1", routesV1);
// middleware.use((req, res, next) => next(new NotFoundError()));
routes.use((req, res, next) => next("not found error"));

routes.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res.status(500).send(err.message);
});

export { routes };
