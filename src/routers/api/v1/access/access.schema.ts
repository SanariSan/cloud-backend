import Joi from "joi";
import { JoiBearerHeader } from "../../../../helpers";

export const Schema = {
	auth: Joi.object()
		.keys({
			authorization: JoiBearerHeader().required(),
		})
		.unknown(true),
	login: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	}),
	signup: Joi.object().keys({
		name: Joi.string().min(3).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		profilePicUrl: Joi.string().uri().optional(),
	}),
	refresh: Joi.object().keys({
		refreshToken: Joi.string().required().min(1),
	}),
	changePassword: Joi.object().keys({
		oldPassword: Joi.string().min(6).required(),
		newPassword: Joi.string().min(6).required(),
	}),
};
