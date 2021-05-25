import { Response, NextFunction } from "express";
import { InternalError, SuccessMsgResponse } from "../../../../core";
import { ProtectedRequest } from "../../../../types";

export const Logout = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    await req.keystoreRepository.removeRecord().catch(e => {
        throw new InternalError();
    });

    return new SuccessMsgResponse("Logout success").send(res);
};
