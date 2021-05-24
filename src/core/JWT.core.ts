import { promisify } from "util";
import { sign, verify } from "jsonwebtoken";
import { InternalError, BadTokenError, TokenExpiredError } from "./api-error.core";
import { Logger } from "./logger.core";
import config from "config";

export class JWT {
    //create token with the payload attached
    public static async encode(payload: JwtPayload): Promise<string> {
        const secret = config.get("jwt.secret");
        if (!secret) throw new InternalError("Token generation failure");
        // @ts-ignore
        return await promisify(sign)({ ...payload }, secret, { algorithm: "HS256" });
    }

    //get payload only if valid
    public static async validate(token: string): Promise<JwtPayload> {
        const secret = config.get("jwt.secret");
        try {
            // @ts-ignore
            return (await promisify(verify)(token, secret, { algorithm: "HS256" })) as JwtPayload;
        } catch (e) {
            Logger.debug(e);
            if (e && e.name === "TokenExpiredError") throw new TokenExpiredError();

            // any other error with token except expired
            throw new BadTokenError();
        }
    }

    // get payload even if expired
    public static async validateNoExp(token: string): Promise<JwtPayload> {
        const secret = config.get("jwt.secret");

        try {
            // @ts-ignore
            return (await promisify(verify)(token, secret, {
                ignoreExpiration: true,
                algorithm: "HS256",
            })) as JwtPayload;
        } catch (e) {
            Logger.debug(e);
            throw new BadTokenError();
        }
    }
}

//audience -aud— Basically identity of the intended recipient of the token.
//subject -sub— Intended user of the token.
//issuer -iss— Software organization who issues the token.
//issuedAt-iat-Timestamp of token creation
//expiresIn-exp— Expiration time after which the token will be invalid.
//prm -param -custom field, stands for access/refresh token depending on what we using this class for

export class JwtPayload {
    aud: string;
    sub: number;
    iss: string;
    iat: number;
    exp: number;
    prm: string;

    constructor(issuer: string, audience: string, subject: number, param: string, validForDays: number) {
        this.iss = issuer;
        this.aud = audience;
        this.sub = subject;
        this.prm = param;
        this.iat = Math.floor(Date.now() / 1000);
        this.exp = this.iat + validForDays * 24 * 60 * 60;
    }
}
