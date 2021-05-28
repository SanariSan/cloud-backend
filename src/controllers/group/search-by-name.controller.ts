import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { NoEntryError, SuccessResponse } from "../../core";
import { USER_RELATIONS } from "../../database";

// req.body.send === [{ownerId: id, groupId: id, groupName: string}, ...]
// req.body === groupName
export const SearchByName = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	let result: Array<{
		ownerId: number;
		groupId: number;
		groupName: string;
	}> = [];

	await req.userRepository.findByIds([], [USER_RELATIONS.GROUP_OWNAGE]);
	const userRecords = req.userRepository.getRecords();
	if (!userRecords) throw new NoEntryError("No Users Found");

	const filteredUsers = userRecords
		.filter((el) => el.groupOwnage)
		.filter((el) => el.groupOwnage.name === req.body.groupName);

	if (filteredUsers.length !== 0)
		result = filteredUsers.map((el) => ({
			ownerId: el.id,
			groupId: el.groupOwnage.id,
			groupName: el.groupOwnage.name,
		}));

	return new SuccessResponse("Groups found", result).send(res);
};
