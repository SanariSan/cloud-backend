import { NotFoundError, ApiError, InternalError } from "../core";
import { NextFunction, Request, Response } from "express";
import { Logger } from "../core";

function errorHandler(app) {
    app.use((req: Request, res: Response, next: NextFunction) => next(new NotFoundError()));
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        //for rare cases when something broke while streaming data to client
        //fallback to default express handler
        if (res.headersSent) {
            return next(err);
        }

        if (err instanceof ApiError) {
            ApiError.handle(err, res);
        } else {
            Logger.warn(err);
            // return res.status(500).send(err.message);
            ApiError.handle(new InternalError(), res);
        }
    });
}

export { errorHandler };