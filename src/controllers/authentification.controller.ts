import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../types";
import { JWT, AuthFailureError, AccessTokenError, TokenExpiredError, InternalError } from "../core";
import { getToken, validateTokenData } from "../helpers";

const Authentificate = async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<any> => {
    const accessToken = getToken(req.headers.authorization);

    try {
        const accessTokenPayload = await JWT.validate(accessToken);
        validateTokenData(accessTokenPayload);

        let user = await req.userRepository
            .findById(accessTokenPayload.sub)
            .then(_ => _.getRecord())
            .catch(e => {
                throw new InternalError();
            });
        if (!user) throw new AuthFailureError("User not registered");

        let keystore = await req.keystoreRepository
            .findByToken(accessTokenPayload.prm)
            .then(_ => _.getRecord())
            .catch(e => {
                throw new InternalError();
            });
        if (!keystore) throw new AuthFailureError("Invalid access token");

        req.accessToken = accessToken;
        return next();
    } catch (e) {
        if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
        throw e;
    }
};

export { Authentificate };
