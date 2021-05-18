import { Tokens } from "../types";
import { JWT, JwtPayload, AuthFailureError, InternalError } from "../core";
import { User } from "../database";
import config from "config";

const { accessTokenValidDays, refreshTokenValidDays, issuer, audience } = config.get("jwt");

export const validateTokenData = (payload: JwtPayload): boolean => {
    if (
        !payload ||
        !payload.iss ||
        !payload.sub ||
        !payload.aud ||
        !payload.prm ||
        payload.iss !== issuer ||
        payload.aud !== audience
    )
        throw new AuthFailureError("Invalid Access Token");
    return true;
};

export const createTokens = async (user: User, accessTokenKey: string, refreshTokenKey: string): Promise<Tokens> => {
    const accessToken = await JWT.encode(
        new JwtPayload(issuer, audience, user.id, accessTokenKey, accessTokenValidDays),
    );

    if (!accessToken) throw new InternalError();

    const refreshToken = await JWT.encode(
        new JwtPayload(issuer, audience, user.id, refreshTokenKey, refreshTokenValidDays),
    );

    if (!refreshToken) throw new InternalError();

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    } as Tokens;
};
