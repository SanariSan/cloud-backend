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
		!req.params ||
		!req.params.groupId ||
		isNaN(parseInt(req.params.groupId)) ||
		!userRecord.groupsParticipate ||
		!userRecord.groupsParticipate.length ||
		!userRecord.groupsParticipate.some((el) => el.id === parseInt(req.params.groupId))
	) {
		throw new AuthorizationError();
	}

	next();
};

export { CheckGroupPermission };