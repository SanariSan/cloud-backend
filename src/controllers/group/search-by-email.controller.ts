import { NextFunction, Response } from "express";
import { SuccessResponse } from "../../core";
import { EUSER_RELATIONS } from "../../database/connection";
import { ProtectedRequest } from "../../types-global";

// req.body.send === [{ownerId: id, groupId: id, groupName: string}, ...]
// req.body === ownerEmail
export const GroupSearchByEmail = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
) => {
	//array just for compatibility with other search methods
	let result: Array<{
		ownerId: number;
		ownerName: string | null;
		ownerEmail: string;
		groupId: number;
		groupName: string;
	}> = [];

	//get user record if exists
	await req.userRepository.findByEmail(req.body.ownerEmail, [EUSER_RELATIONS.GROUP_OWNAGE]);
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) return new SuccessResponse("Groups found", result).send(res);

	//if this user has his own group - return it's info
	if (userRecord.groupOwnage)
		result = [
			{
				ownerId: userRecord.id,
				ownerName: userRecord.name,
				ownerEmail: userRecord.email,
				groupId: userRecord.groupOwnage.id,
				groupName: userRecord.groupOwnage.name,
			},
		];

	return new SuccessResponse("Groups found", result).send(res);
};
