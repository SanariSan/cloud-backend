import { Request, Response, NextFunction } from "express";
import { SuccessResponse, BadRequestError, AuthFailureError, InternalError } from "../../../../core";
import { createTokens } from "../../../../helpers";
import { DBManager, Keystore, KeystoreRepository, User, UserRepository } from "../../../../database";
import { ConnectionOptions } from "typeorm";
import crypto from "crypto";
import bcrypt from "bcrypt";
import config from "config";

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, [User, Keystore]);
    const connection = (await dbManager.createConnection()).getConnection();

    let user;
    try {
        user = await UserRepository.findByEmail(connection, req.body.email, ["keystore"]);
    } catch (err) {
        throw new InternalError();
    }

    if (!user) throw new BadRequestError("User not registered");
    if (!user.password) throw new BadRequestError("Credential not set");

    const match: boolean = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Authentication failure");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    const keystore: Keystore = await KeystoreRepository.create(accessTokenKey, refreshTokenKey);
    await KeystoreRepository.save(connection, keystore);

    user.keystore.push(keystore);
    await UserRepository.save(connection, user);

    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    new SuccessResponse("Login Success", {
        user: { id: user.id, name: user.name, profilePicUrl: user.profilePicUrl },
        tokens: tokens,
    }).send(res);
};
