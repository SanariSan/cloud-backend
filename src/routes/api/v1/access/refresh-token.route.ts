import { Response, NextFunction } from "express";
import { ConnectionOptions } from "typeorm";
import { AuthFailureError, InternalError, JWT, TokenRefreshResponse } from "../../../../core";
import { DBManager, Keystore, KeystoreRepository, User, UserRepository } from "../../../../database";
import { ProtectedRequest } from "../../../../types";
import { getToken, validateTokenData, createTokens } from "../../../../helpers";
import config from "config";
import crypto from "crypto";

export const Refresh = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    req.accessToken = getToken(req.headers.authorization);

    const accessTokenPayload = await JWT.validateNoExp(req.accessToken);
    validateTokenData(accessTokenPayload);

    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, [User, Keystore]);
    const connection = (await dbManager.createConnection()).getConnection();

    let user: User;
    try {
        user = await UserRepository.findById(connection, accessTokenPayload.sub, ["keystore"]);
    } catch (err) {
        throw new InternalError();
    }
    if (!user) throw new AuthFailureError("User not registered");

    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub) throw new AuthFailureError("Access token holder mismatch");

    const keystore = await KeystoreRepository.findByBothTokens(
        connection,
        accessTokenPayload.prm,
        refreshTokenPayload.prm,
    );
    if (!keystore) throw new AuthFailureError("Token not found");

    await KeystoreRepository.remove(connection, keystore.id);

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    const newKeystore: Keystore = await KeystoreRepository.create(accessTokenKey, refreshTokenKey);
    await KeystoreRepository.save(connection, newKeystore);

    user.keystore?.push(newKeystore);
    await UserRepository.save(connection, user);

    const tokens = await createTokens(req.user, accessTokenKey, refreshTokenKey);

    new TokenRefreshResponse("Token Issued", tokens.accessToken, tokens.refreshToken).send(res);
};
