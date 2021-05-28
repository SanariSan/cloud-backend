import Joi from "joi";
import { JoiBearerHeader } from "../../../../helpers";

export const Schema = {
	userCredential: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
	}),
	refreshToken: Joi.object().keys({
		refreshToken: Joi.string().required().min(1),
	}),
	auth: Joi.object()
		.keys({
			authorization: JoiBearerHeader().required(),
		})
		.unknown(true),
	signup: Joi.object().keys({
		name: Joi.string().min(3).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).required(),
		profilePicUrl: Joi.string().uri().optional(),
	}),
};
