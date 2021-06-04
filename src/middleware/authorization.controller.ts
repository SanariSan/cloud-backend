import { NextFunction, Response } from "express";
import { AuthorizationError } from "../core";
import { ProtectedRequest } from "../types";

const CheckGroupPermission = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	if (req.body) {
		if (
			!req.body.groupId ||
			isNaN(parseInt(req.body.groupId)) ||
			!userRecord.groupsParticipate ||
			!userRecord.groupsParticipate.length ||
			!userRecord.groupsParticipate.some((el) => el.id === parseInt(req.body.groupId))
		) {
			throw new AuthorizationError();
		}
	} else if (req.params) {
		if (
			!req.params.groupId ||
			isNaN(parseInt(req.params.groupId)) ||
			!userRecord.groupsParticipate ||
			!userRecord.groupsParticipate.length ||
			!userRecord.groupsParticipate.some((el) => el.id === parseInt(req.params.groupId))
		) {
			throw new AuthorizationError();
		}
	}

	next();
};

export { CheckGroupPermission };
