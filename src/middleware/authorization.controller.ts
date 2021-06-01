import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../types";
import { AuthorizationError } from "../core";

const CheckGroupPermission = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	if (
		req.body.groupId !== userRecord.groupOwnage ||
		!userRecord.groupsParticipate ||
		!userRecord.groupsParticipate.length ||
		!userRecord.groupsParticipate.includes(req.body.groupId)
	) {
		throw new AuthorizationError();
	}

	next();
};

export { CheckGroupPermission };
