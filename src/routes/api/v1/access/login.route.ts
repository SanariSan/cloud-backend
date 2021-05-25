import { Response, NextFunction } from "express";
import { SuccessResponse, BadRequestError, AuthFailureError, InternalError } from "../../../../core";
import { setNewTokenPair } from "../../../../helpers";
import { ENTITIES } from "../../../../database";
import { PreparedRequest } from "../../../../types";
import bcrypt from "bcrypt";

export const Login = async (req: PreparedRequest, res: Response, next: NextFunction) => {
    let user = await req.userRepository
        .findByEmail(req.body.email, [ENTITIES.KEYSTORE.toLowerCase()])
        .then(_ => _.getRecord())
        .catch(e => {
            throw new InternalError();
        });
    if (!user) throw new BadRequestError("User not registered");
    if (!user.password) throw new BadRequestError("Credential not set");

    const matchPass: boolean = await bcrypt.compare(req.body.password, user.password);
    if (!matchPass) throw new AuthFailureError("Authentication failure");

    const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);
    new SuccessResponse("Login Success", {
        user: req.userRepository.getRecord(["id", "name", "email", "profilePicUrl"]),
        tokens: tokens,
    }).send(res);
};
