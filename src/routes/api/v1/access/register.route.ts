import { Response, NextFunction } from "express";
import { setNewTokenPair } from "../../../../helpers";
import { BadRequestError, InternalError, SuccessResponse } from "../../../../core";
import { PreparedRequest } from "../../../../types";
import bcrypt from "bcrypt";

export const Register = async (req: PreparedRequest, res: Response, next: NextFunction) => {
    let user = await req.userRepository
        .findByEmail(req.body.email)
        .then(_ => _.getRecord())
        .catch(e => {
            throw new InternalError();
        });
    if (user) throw new BadRequestError("User already registered");

    await req.userRepository
        .createUser({
            name: req.body.name,
            email: req.body.email,
            profilePicUrl: req.body.profilePicUrl,
            password: await bcrypt.hash(req.body.password, 12),
        })
        .saveRecord();

    const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);
    new SuccessResponse("Signup Successful", {
        user: req.userRepository.getRecord(["id", "name", "email", "profilePicUrl"]),
        tokens: tokens,
    }).send(res);
};
