import { Tokens } from "./auth.type";
import { AuthFailureError, InternalError } from "../core";
import { JWT, JwtPayload } from "../core";
// import { Types } from "mongoose";
// import User from "../database/model/User";
import config from "config";
const { accessTokenValidDays, refreshTokenValidDays, issuer, audience } = config.get("token");

export const validateTokenData = (payload: JwtPayload): boolean => {
    if (
        !payload ||
        !payload.iss ||
        !payload.sub ||
        !payload.aud ||
        !payload.prm ||
        payload.iss !== issuer ||
        payload.aud !== audience
        // ||
        // !Types.ObjectId.isValid(payload.sub)
    )
        throw new AuthFailureError("Invalid Access Token");
    return true;
};

export const createTokens = async (user: any, accessTokenKey: string, refreshTokenKey: string): Promise<Tokens> => {
    const accessToken = await JWT.encode(
        new JwtPayload(issuer, audience, user._id.toString(), accessTokenKey, accessTokenValidDays),
    );

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(
        new JwtPayload(issuer, audience, user._id.toString(), refreshTokenKey, refreshTokenValidDays),
    );

    if (!refreshToken) throw new InternalError();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    } as Tokens;
};
