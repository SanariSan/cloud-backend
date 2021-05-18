import { Request, Response, NextFunction } from "express";

type AsyncRouterFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

//explicit fn params accepting from enclosure (original) => (here) => {execute original with its' params}
export const asyncHandle = (execution: AsyncRouterFunction) => (req: Request, res: Response, next: NextFunction) => {
    execution(req, res, next).catch(next);
};
