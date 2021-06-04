import Joi from "joi";
import { JoiBearerHeader } from "../../../../helpers";

export const schema = {
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
		name: Joi.string().required().min(3),
		email: Joi.string().required().email(),
		password: Joi.string().required().min(6),
		profilePicUrl: Joi.string().optional().uri(),
	}),
};
