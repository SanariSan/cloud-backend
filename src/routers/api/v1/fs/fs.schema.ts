import Joi from "joi";
import { JoiBearerHeader } from "../../../../helpers";

export const Schema = {
	auth: Joi.object()
		.keys({
			authorization: JoiBearerHeader().required(),
		})
		.unknown(true),
	create: Joi.object().keys({
		groupName: Joi.string().min(6).required(),
		password: Joi.string().min(6).required(),
	}),
	paramsShort: Joi.object().keys({
		groupId: Joi.string().min(1).required(),
		path: Joi.string().min(1).required(),
	}),
	paramsActions: Joi.object().keys({
		groupId: Joi.string().min(1).required(),
		path: Joi.string().min(1).required(),
		filename: Joi.string().min(1).required(),
	}),
};
