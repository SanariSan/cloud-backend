import { Request, Response, NextFunction } from "express";
import { PreparedRequest, ProtectedRequest } from "../types";

type AsyncRouterFunction = (
    req: Request | PreparedRequest | ProtectedRequest | any,
    res: Response,
    next: NextFunction,
) => Promise<any>;

//explicit fn params accepting from enclosure (original) => (here) => {execute original with its' params}
export const asyncHandle = (execution: AsyncRouterFunction) => (
    req: Request | PreparedRequest | ProtectedRequest | any,
    res: Response,
    next: NextFunction,
) => {
    execution(req, res, next).catch(next);
};
