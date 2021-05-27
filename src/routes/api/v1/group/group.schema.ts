import Joi from "joi";
import { JoiBearerHeader } from "../../../../helpers";

export const schema = {
    auth: Joi.object()
        .keys({
            authorization: JoiBearerHeader().required(),
        })
        .unknown(true),
    groupCreate: Joi.object().keys({
        groupName: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    }),
    // groupJoin: Joi.object().keys({
    //     groupId: id,
    //     password: string
    // }),
    // groupLeave: Joi.object().keys({
    //     refreshToken: Joi.string().required().min(1),
    // }),
    // groupChangePassword: Joi.object().keys({
    //     refreshToken: Joi.string().required().min(1),
    // }),
    // groupSearchByName: Joi.object().keys({
    //     refreshToken: Joi.string().required().min(1),
    // }),
    // groupSearchByEmail: Joi.object().keys({
    //     refreshToken: Joi.string().required().min(1),
    // }),
};
