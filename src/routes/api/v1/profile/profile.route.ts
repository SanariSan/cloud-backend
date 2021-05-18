import { Request, Response, NextFunction } from "express";
import {
    AuthFailureError,
    BadRequestError,
    ForbiddenError,
    NoDataError,
    SuccessMsgResponse,
    SuccessResponse,
    TokenRefreshResponse,
    AccessTokenErrorResponse,
} from "../../../../core";
import { ProtectedRequest } from "../../../../types";

// export const Profile = async (req: Request, res: Response, next: NextFunction) => {
//     new SuccessResponse("success", { "1": 23 }).send(res);
// };
export const Profile1 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    return new SuccessResponse("Test passed", {
        user: req.user,
        keystore: req.keystore,
        accessToken: req.accessToken,
    }).send(res);
};
// export const Profile2 = async (req: Request, res: Response, next: NextFunction) => {
//     new TokenRefreshResponse("Token Issued", "token here", "refresh here").send(res);
// };
// export const Profile3 = async (req: Request, res: Response, next: NextFunction) => {
//     throw new BadRequestError("Credential not set");
// };
// export const Profile4 = async (req: Request, res: Response, next: NextFunction) => {
//     throw new NoDataError();
// };
// export const Profile5 = async (req: Request, res: Response, next: NextFunction) => {
//     return new SuccessMsgResponse("Blog published successfully").send(res); // delete/put
// };
// export const Profile6 = async (req: Request, res: Response, next: NextFunction) => {
//     // if (!blog.author._id.equals(req.user._id))
//     throw new ForbiddenError("You don't have necessary permissions");
// };
// export const Profile7 = async (req: Request, res: Response, next: NextFunction) => {
//     new AccessTokenErrorResponse().send(res);
// };
