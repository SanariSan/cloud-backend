import { NextFunction, Request, Response } from "express";
import Joi, { isError } from "joi";
import { BadRequestError, Logger } from "../core";
import { ValidationSource } from "./types.helper.type";

export const JoiUrlValidate = () =>
	Joi.string().custom((value: string, helpers) => {
		if (value.includes("://")) return helpers.error("any.invalid");
		return value;
	}, "Url Endpoint Validation");

export const JoiBearerHeader = () =>
	Joi.string().custom((value: string, helpers) => {
		if (!value.startsWith("Bearer ") || !value.split(" ")[1])
			return helpers.error("any.invalid");
		return value;
	}, "Authorization Header Validation");

export const Validate =
	(schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validateAsync(req[source], {
				abortEarly: false,
			});

			return next();
		} catch (err) {
			let message = (err as Error).message;
			if (isError(err)) {
				const { details } = err;
				message = details.map((el, i) => `${el.message.replace(/"/g, "")}`).join(";");

				Logger.debug(details);
			}
			next(new BadRequestError(message));
		}
	};
