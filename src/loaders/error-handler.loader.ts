// import { NotFoundError, ApiError, InternalError } from "./core/ApiError";
import { NextFunction, Request, Response, Router } from "express";
import { Logger } from "../helpers";

const errorHandler = Router();

// middleware.use((req, res, next) => next(new NotFoundError()));
errorHandler.use((req, res, next) => next("not found error"));

errorHandler.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err); //if error is uncommon (!!)
    return res.status(500).send(err.message);
});

export { errorHandler };

// import config from "config";
// const environment = config.get("environment");
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// middleware.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     if (err instanceof ApiError) {
//         ApiError.handle(err, res);
//     } else { (!!)
//         if (environment === "development") {
//             // Logger.error(err);
//             console.log(err);
//             return res.status(500).send(err.message);
//         }
//         ApiError.handle(new InternalError(), res);
//     }
// });
