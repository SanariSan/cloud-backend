import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../types";
import { UserRepository, KeystoreRepository, DBManager, User, Keystore } from "../database";
import { JWT, AuthFailureError, AccessTokenError, TokenExpiredError, InternalError } from "../core";
import { getToken, validateTokenData } from "../helpers";
import { ConnectionOptions } from "typeorm";
import config from "config";

const Authentificate = async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<any> => {
    const accessToken = getToken(req.headers.authorization);

    try {
        const accessTokenPayload = await JWT.validate(accessToken);
        validateTokenData(accessTokenPayload);

        const options: ConnectionOptions = config.get("db.auth");
        const dbManager: DBManager = new DBManager(options, [User, Keystore]);
        const connection = (await dbManager.createConnection()).getConnection();

        let user;
        try {
            user = await UserRepository.findById(connection, accessTokenPayload.sub);
        } catch (err) {
            throw new InternalError();
        }
        if (!user) throw new AuthFailureError("User not registered");

        let keystore;
        try {
            keystore = await KeystoreRepository.findByToken(connection, accessTokenPayload.prm);
        } catch (err) {
            throw new InternalError();
        }
        if (!keystore) throw new AuthFailureError("Invalid access token");

        req.user = user;
        req.keystore = keystore;
        req.accessToken = accessToken;

        return next();
    } catch (e) {
        if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
        throw e;
    }
};

export { Authentificate };
