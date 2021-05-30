import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { NoEntryError, SuccessResponse } from "../../core";
import { EUSER_RELATIONS } from "../../database";

// req.body.send === [{ownerId: id, groupId: id, groupName: string}, ...]
// req.body === groupName
export const GroupSearchByName = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
) => {
	let result: Array<{
		ownerId: number;
		groupId: number;
		groupName: string;
	}> = [];

	//get all existing users records, if any exist :_)
	await req.userRepository.findByIds([], [EUSER_RELATIONS.GROUP_OWNAGE]);
	const userRecords = req.userRepository.getRecords();
	if (!userRecords || !userRecords.some((el) => el)) throw new NoEntryError("No Users Found");

	//get users who own groups and whose group name matches search request/includes search request
	//sort by name and take top 50
	const filteredUsers = userRecords
		.filter((el) => el.groupOwnage)
		.filter((el) => el.groupOwnage.name.includes(req.body.groupName))
		.sort((a, b) => b.groupOwnage.name.length - a.groupOwnage.name.length)
		.slice(0, 50);

	//if any groups found - return info
	if (filteredUsers.length !== 0)
		result = filteredUsers.map((el) => ({
			ownerId: el.id,
			groupId: el.groupOwnage.id,
			groupName: el.groupOwnage.name,
		}));

	return new SuccessResponse("Groups found", result).send(res);
};
