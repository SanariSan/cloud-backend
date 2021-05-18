import express, { Response, NextFunction } from "express";
import { ProtectedRequest } from "../types";
import { UserRepository, KeystoreRepository, DBManager, User, Keystore } from "../database";
import { JWT, AuthFailureError, AccessTokenError, TokenExpiredError, InternalError } from "../core";
import { asyncHandle, validate, ValidationSource, getAccessToken, validateTokenData } from "../helpers";
import { ConnectionOptions } from "typeorm";
import schema from "./schema";
import config from "config";

const Authentificate = express.Router();

const Auth = async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<any> => {
    const accessToken = getAccessToken(req.headers.authorization);

    try {
        const payload = await JWT.validate(accessToken);
        validateTokenData(payload);

        const options: ConnectionOptions = config.get("db.auth");
        const dbManager: DBManager = new DBManager(options, [User, Keystore]);
        const connection = (await dbManager.createConnection()).getConnection();

        let user;
        try {
            user = await UserRepository.findById(connection, payload.sub);
        } catch (err) {
            throw new InternalError();
        }
        if (!user) throw new AuthFailureError("User not registered");

        let keystore;
        try {
            keystore = await KeystoreRepository.findByToken(connection, payload.prm);
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

Authentificate.use(validate(schema.auth, ValidationSource.HEADER), asyncHandle(Auth));

export { Authentificate };
