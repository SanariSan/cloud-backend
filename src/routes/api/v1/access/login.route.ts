import { Request, Response, NextFunction, Router } from "express";
import { SuccessResponse, BadRequestError, AuthFailureError } from "../../../../core";
import { createTokens } from "../../../../auth";
import crypto from "crypto";
import bcrypt from "bcrypt";
// import UserRepo from '../../../database/repository/UserRepo';
// import KeystoreRepo from '../../../database/repository/KeystoreRepo';

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    // const user = await UserRepo.findByEmail(req.body.email);

    //remove
    const createdUser = {
        id: Math.round(Math.random() * 10),
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
    };

    const user = {
        email: "e@m.ru",
        password: "123467",
    };
    if (!user) throw new BadRequestError("User not registered");
    if (!user.password) throw new BadRequestError("Credential not set");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Authentication failure");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    // await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    new SuccessResponse("Login Success", {
        user: createdUser,
        tokens: tokens,
    }).send(res);
};
