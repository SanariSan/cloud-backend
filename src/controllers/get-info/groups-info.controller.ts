import { Response, NextFunction } from "express";
import { SuccessResponse } from "../../core";
import { EGROUP_KEYS, EGROUP_PATH_KEYS, EGROUP_RELATIONS } from "../../database/connection";
import { ProtectedRequest } from "../../types-global";

// req.body.send === {groupInfo: {id, name}, storageSize: {sizeUsed, sizeMax}}
// req.body === id: groupId
export const GroupInfo = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	let result: Array<{ ownerId: number; groupId: number }> = [];

	await req.groupRepository.findById(req.body.id, [
		EGROUP_RELATIONS.USERS_PARTICIPATE,
		EGROUP_RELATIONS.GROUP_PATH,
	]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	const groupParticipants = groupRecord.usersParticipate.map((el) => ({
		id: el.id,
		name: el.name,
		email: el.email,
		profilePicUrl: el.profilePicUrl,
	}));

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
	//return group participants

	return new SuccessResponse("Groups found", {
		groupInfo: req.groupRepository.getRecord([EGROUP_KEYS.ID, EGROUP_KEYS.NAME]),
		groupParticipants,
		storageInfo: req.groupPathRepository.getRecord([
			EGROUP_PATH_KEYS.SIZE_USED,
			EGROUP_PATH_KEYS.SIZE_MAX,
		]),
	}).send(res);
};
