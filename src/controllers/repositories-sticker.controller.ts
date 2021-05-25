import { Response, NextFunction } from "express";
import { PreparedRequest } from "../types";
import { UserRepository, KeystoreRepository, DBManager, ENTITIES, GroupRepository } from "../database";

const StickRepos = async (req: PreparedRequest, res: Response, next: NextFunction): Promise<any> => {
    const dbManager: DBManager = await new DBManager([
        ENTITIES.USER,
        ENTITIES.KEYSTORE,
        ENTITIES.GROUP,
    ]).createConnection();
    req.userRepository = await new UserRepository(dbManager);
    req.keystoreRepository = await new KeystoreRepository(dbManager);
    req.groupRepository = await new GroupRepository(dbManager);

    next();
};

export { StickRepos };
