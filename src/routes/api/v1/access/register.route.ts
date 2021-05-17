import { Request, Response, NextFunction } from "express";
import { SuccessResponse } from "../../../../core";
import { createTokens } from "../../../../auth";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    // const user = await UserRepo.findByEmail(req.body.email);
    // if (user) throw new BadRequestError("User already registered");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");
    // const passwordHash = await bcrypt.hash(req.body.password, 12);

    const createdUser = {
        id: Math.round(Math.random() * 10),
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
    };

    const keystore = { accessTokenKey, refreshTokenKey };

    // const { user: createdUser, keystore } = await UserRepo.create(
    //     {
    //         name: req.body.name,
    //         email: req.body.email,
    //         profilePicUrl: req.body.profilePicUrl,
    //         password: passwordHash,
    //     } as User,
    //     accessTokenKey,
    //     refreshTokenKey,
    //     RoleCode.LEARNER,
    // );

    const tokens = await createTokens(createdUser, keystore.accessTokenKey, keystore.refreshTokenKey);
    new SuccessResponse("Signup Successful", {
        user: createdUser,
        tokens: tokens,
    }).send(res);
};
