import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../../types";
import { SuccessResponse } from "../../../../core";

export const Profile1 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    return new SuccessResponse("Test passed", {
        user: req.userRepository.getRecord(["id", "name", "email", "profilePicUrl"]),
        keystore: req.keystoreRepository.getRecord(["id", "accessTokenKey", "refreshTokenKey"]),
    }).send(res);
};
