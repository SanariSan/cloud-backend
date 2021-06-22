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
	join: Joi.object().keys({
		groupId: Joi.number().required(),
		password: Joi.string().min(6).required(),
	}),
	kick: Joi.object().keys({
		groupId: Joi.number().required(),
		userId: Joi.number().required(),
	}),
	changePassword: Joi.object().keys({
		oldPassword: Joi.string().min(6).required(),
		newPassword: Joi.string().min(6).required(),
	}),
	searchByName: Joi.object().keys({
		groupName: Joi.string().min(6).required(),
	}),
	searchByEmail: Joi.object().keys({
		ownerEmail: Joi.string().email().required(),
	}),
};
