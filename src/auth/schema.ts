import Joi from "joi";
import { JoiBearerHeader } from "../helpers";

export default {
    auth: Joi.object()
        .keys({
            authorization: JoiBearerHeader().required(),
        })
        .unknown(true),
};
