import { Request, Response, NextFunction } from "express";

export const Profile = (req: Request, res: Response, next: NextFunction) => {
    res.send("12345");
};
