import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { NoEntryError, SuccessResponse } from "../../core";
import { USER_RELATIONS } from "../../database";

// req.body.send === [{ownerId: id, groupId: id, groupName: string}, ...]
// req.body === ownerEmail
export const SearchByEmail = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	let result: Array<{
		ownerId: number;
		groupId: number;
		groupName: string;
	}> = [];

	await req.userRepository.findByEmail(req.body.ownerEmail, [USER_RELATIONS.GROUP_OWNAGE]);
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new NoEntryError("No Users Found");

	if (userRecord.groupOwnage)
		result = [
			{
				ownerId: userRecord.id,
				groupId: userRecord.groupOwnage.id,
				groupName: userRecord.groupOwnage.name,
			},
		];

	return new SuccessResponse("Groups found", result).send(res);
};
