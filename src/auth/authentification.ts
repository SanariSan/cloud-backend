import express, { Request, Response, NextFunction } from "express";
// import { ProtectedRequest } from "./auth.type";
// import UserRepo from "../database/repository/UserRepo";
// import KeystoreRepo from "../database/repository/KeystoreRepo";
// import { Types } from "mongoose";
import { JWT, AuthFailureError, AccessTokenError, TokenExpiredError } from "../core";
import { validateTokenData } from "./authUtils";
import { AsyncHandle, validate, ValidationSource, getAccessToken } from "../helpers";
import schema from "./schema";

const Authentificate = express.Router();

const Auth = async (req: any, res: Response, next: NextFunction): Promise<any> => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
        const payload = await JWT.validate(req.accessToken);
        validateTokenData(payload);

        // const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
        // if (!user) throw new AuthFailureError("User not registered");
        // req.user = user;

        // const keystore = await KeystoreRepo.findforKey(req.user._id, payload.prm);
        // if (!keystore) throw new AuthFailureError("Invalid access token");
        // req.keystore = keystore;

        return next();
    } catch (e) {
        if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
        throw e;
    }
};

Authentificate.use(validate(schema.auth, ValidationSource.HEADER), AsyncHandle(Auth));

export { Authentificate };

// import express, { Request, Response, NextFunction } from "express";

// type AsyncRouterFunction = (req: Request | ProtectedRequest, res: Response, next: NextFunction) => Promise<any>;

// export const AsyncHandle = (execution: AsyncRouterFunction) => (req: Request | ProtectedRequest, res: Response, next: NextFunction) => {
//     execution(req, res, next).catch(next);
// };

// //---

// interface ProtectedRequest extends Request {
//     user: any;
//     accessToken: string;
//     keystore: any;
// }

// const AuthRouter = express.Router();
// const Auth = async (req: ProtectedRequest, res: Response, next: NextFunction): Promise<any> => {
//     req.accessToken = getAccessToken(req.headers.authorization);
//     req.user = {};
//     req.keystore = {};
//     try {
//         const payload = await JWT.validate(req.accessToken);
//         validateTokenData(payload);
//         return next();
//     } catch (e) {
//         throw e;
//     }
// };

// AuthRouter.use(validate(schema.auth, ValidationSource.HEADER), AsyncHandle(Auth));
