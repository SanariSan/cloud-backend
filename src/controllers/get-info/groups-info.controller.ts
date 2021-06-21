import { Response, NextFunction } from "express";
import { SuccessResponse } from "../../core";
import { EGROUP_KEYS, EGROUP_PATH_KEYS, EGROUP_RELATIONS } from "../../database/connection";
import { ProtectedRequest } from "../../types";

// req.body.send === {groupInfo: {id, name}, storageSize: {sizeUsed, sizeMax}}
// req.body === id: groupId
export const GroupInfo = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	let result: Array<{ ownerId: number; groupId: number }> = [];

	await req.groupRepository.findById(req.body.id, [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	if (userRecord.groupOwnage)
		result = [
			{
				ownerId: userRecord.id,
				groupId: userRecord.groupOwnage.id,
			},
		];

	return new SuccessResponse("Groups found", {
		groupInfo: req.groupRepository.getRecord([EGROUP_KEYS.ID, EGROUP_KEYS.NAME]),
		storageInfo: req.groupPathRepository.getRecord([
			EGROUP_PATH_KEYS.SIZE_USED,
			EGROUP_PATH_KEYS.SIZE_MAX,
		]),
	}).send(res);
};
