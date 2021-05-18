import { Response, NextFunction } from "express";
import { ConnectionOptions } from "typeorm";
import { InternalError, SuccessMsgResponse, SuccessResponse } from "../../../../core";
import { DBManager, Keystore, KeystoreRepository, User } from "../../../../database";
import { ProtectedRequest } from "../../../../types";
import config from "config";

export const Logout = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, [User, Keystore]);
    const connection = (await dbManager.createConnection()).getConnection();

    let user;
    try {
        user = await await KeystoreRepository.remove(connection, req.keystore.id);
    } catch (err) {
        throw new InternalError();
    }

    return new SuccessMsgResponse("Logout success").send(res);
};
