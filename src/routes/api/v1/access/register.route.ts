import { Request, Response, NextFunction } from "express";
import { BadRequestError, InternalError, SuccessResponse } from "../../../../core";
import { createTokens } from "../../../../helpers";
import { ConnectionOptions } from "typeorm";
import { DBManager, Keystore, KeystoreRepository, User, UserRepository } from "../../../../database";
import crypto from "crypto";
import bcrypt from "bcrypt";
import config from "config";

export const Register = async (req: Request, res: Response, next: NextFunction) => {
    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, [User, Keystore]);
    const connection = (await dbManager.createConnection()).getConnection();

    let user;
    try {
        user = await UserRepository.findByEmail(connection, req.body.email);
    } catch (err) {
        throw new InternalError();
    }
    if (user) throw new BadRequestError("User already registered");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");
    const passwordHash = await bcrypt.hash(req.body.password, 12);

    const { user: createdUser, keystore } = await UserRepository.create(
        connection,
        <User>{
            name: req.body.name,
            email: req.body.email,
            profilePicUrl: req.body.profilePicUrl,
            password: passwordHash,
        },
        accessTokenKey,
        refreshTokenKey,
    );

    await KeystoreRepository.save(connection, keystore);
    await UserRepository.save(connection, createdUser);

    const tokens = await createTokens(createdUser, <string>keystore.accessTokenKey, <string>keystore.refreshTokenKey);
    new SuccessResponse("Signup Successful", {
        user: createdUser,
        tokens: tokens,
    }).send(res);
};
