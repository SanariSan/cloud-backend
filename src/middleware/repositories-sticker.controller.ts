import { NextFunction, Response } from "express";
import { DBManager, ENTITIES } from "../database/connection";
import {
	GroupPathRepository,
	GroupRepository,
	KeystoreRepository,
	Privelege100Repository,
	Privelege500Repository,
	UserPrivelegeRepository,
	UserRepository,
} from "../database/repositories";
import { PreparedRequest } from "../types-global";

const StickRepos = async (
	req: PreparedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const dbManager: DBManager = await new DBManager([
		ENTITIES.USER,
		ENTITIES.KEYSTORE,
		ENTITIES.GROUP,
		ENTITIES.GROUP_PATH,
		ENTITIES.USER_PRIVELEGE,
		ENTITIES.PRIVELEGE_100,
		ENTITIES.PRIVELEGE_500,
	]).createConnection();

	req.userRepository = await new UserRepository(dbManager);
	req.keystoreRepository = await new KeystoreRepository(dbManager);
	req.groupRepository = await new GroupRepository(dbManager);
	req.userPrivelegeRepository = await new UserPrivelegeRepository(dbManager);
	req.groupPathRepository = await new GroupPathRepository(dbManager);
	req.privelege100Repository = await new Privelege100Repository(dbManager);
	req.privelege500Repository = await new Privelege500Repository(dbManager);

	next();
};

export { StickRepos };
