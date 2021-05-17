import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { Logger, BadRequestError, AuthFailureError } from "../core";
// import { Types } from "mongoose";

export enum ValidationSource {
    BODY = "body",
    HEADER = "headers",
    QUERY = "query",
    PARAM = "params",
}

// export const JoiObjectId = () =>
// Joi.string().custom((value: string, helpers) => {
//     if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
//     return value;
// }, "Object Id Validation");

export const JoiUrlEndpoint = () =>
    Joi.string().custom((value: string, helpers) => {
        if (value.includes("://")) return helpers.error("any.invalid");
        return value;
    }, "Url Endpoint Validation");

export const JoiBearerHeader = () =>
    Joi.string().custom((value: string, helpers) => {
        if (!value.startsWith("Bearer ") || !value.split(" ")[1]) return helpers.error("any.invalid");
        return value;
    }, "Authorization Header Validation");

export const validate = (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const value = await schema.validateAsync(req[source], {
            abortEarly: false,
        });
        //value == { email: 'sample@mail.ru', password: '123444' };
        return next();
    } catch (err) {
        const { details } = err;
        const message = details.map((el, i) => `${i + 1}. ${el.message.replace(/"/g, "")}`).join(";");

        Logger.debug(details);

        next(new BadRequestError(message));
    }
};

export const getAccessToken = (authorization?: string) => {
    if (!authorization) throw new AuthFailureError("Invalid Authorization");
    if (!authorization.startsWith("Bearer ")) throw new AuthFailureError("Invalid Authorization");
    return authorization.split(" ")[1];
};
