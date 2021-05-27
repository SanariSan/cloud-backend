import { Response, NextFunction } from "express";
import { AuthFailureError, JWT, TokenRefreshResponse } from "../../../../core";
import { USER_RELATIONS } from "../../../../database";
import { ProtectedRequest } from "../../../../types";
import { getToken, validateTokenData, setNewTokenPair } from "../../../../helpers";

export const Refresh = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const accessTokenPayload = await JWT.validateNoExp(getToken(req.headers.authorization));
    validateTokenData(accessTokenPayload);
    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    //not sure if it even possible
    if (accessTokenPayload.sub !== refreshTokenPayload.sub) throw new AuthFailureError("Access token holder mismatch");

    //search for user
    await req.userRepository.findById(accessTokenPayload.sub, [USER_RELATIONS.KEYSTORE]);

    //get user's record if exists
    const userRecord = req.userRepository.getRecord();
    if (!userRecord) throw new AuthFailureError("User not registered");

    //search the keystore
    await req.keystoreRepository.findByBothTokens(accessTokenPayload.prm, refreshTokenPayload.prm);

    //get if exists (not needed further, just for the check)
    const keystoreRecord = req.keystoreRepository.getRecord();
    if (!keystoreRecord) throw new AuthFailureError("Token pair not found");

    //delete old expired pair
    await req.keystoreRepository.removeRecord();

    //create fresh new keystore, assign to user
    const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);

    return new TokenRefreshResponse("Token Issued", tokens.accessToken, tokens.refreshToken).send(res);
};
