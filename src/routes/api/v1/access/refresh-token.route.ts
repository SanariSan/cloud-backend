import { Response, NextFunction } from "express";
import { AuthFailureError, InternalError, JWT, TokenRefreshResponse } from "../../../../core";
import { ENTITIES } from "../../../../database";
import { ProtectedRequest } from "../../../../types";
import { getToken, validateTokenData, setNewTokenPair } from "../../../../helpers";

export const Refresh = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    req.accessToken = getToken(req.headers.authorization);

    const accessTokenPayload = await JWT.validateNoExp(req.accessToken);
    validateTokenData(accessTokenPayload);
    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub) throw new AuthFailureError("Access token holder mismatch");

    let user = await req.userRepository
        .findById(accessTokenPayload.sub, [ENTITIES.KEYSTORE.toLowerCase()])
        .then(_ => _.getRecord())
        .catch(e => {
            throw new InternalError();
        });
    if (!user) throw new AuthFailureError("User not registered");

    let keystore = await req.keystoreRepository
        .findByBothTokens(accessTokenPayload.prm, refreshTokenPayload.prm)
        .then(_ => _.getRecord())
        .catch(e => {
            throw new InternalError();
        });
    if (!keystore) throw new AuthFailureError("Token pair not found");
    await req.keystoreRepository.removeRecord();

    const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);
    new TokenRefreshResponse("Token Issued", tokens.accessToken, tokens.refreshToken).send(res);
};
