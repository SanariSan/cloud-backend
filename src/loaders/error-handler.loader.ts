import { NotFoundError, ApiError, InternalError } from "../core";
import { NextFunction, Request, Response } from "express";
import { Logger } from "../core";

function errorHandler(app) {
    app.use((req, res, next) => next(new NotFoundError()));
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        // if (err instanceof ApiError) {

        ApiError.handle(err, res);
        // } else {
        //     //!!
        //     Logger.debug(err);
        //     // return res.status(500).send(err.message);(dev only?)
        //     ApiError.handle(new InternalError(), res);
        // }
    });
}

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
