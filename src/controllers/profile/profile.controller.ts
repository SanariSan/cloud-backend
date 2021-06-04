import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { SuccessResponse } from "../../core";
import { EGROUP_PATH_KEYS, EGROUP_RELATIONS, EUSER_KEYS } from "../../database/connection";

export const Profile1 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const groupsUserIn = req.userRepository.getRecord();
	if (!groupsUserIn) throw new Error();

	let groupsNames: Array<string> = [];
	if (groupsUserIn.groupsParticipate)
		groupsNames = groupsUserIn.groupsParticipate.map((el) => el.name);

	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(userRecord.groupOwnage.id, [EGROUP_RELATIONS.GROUP_PATH]);

	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	const groupPathId = groupRecord.groupPath.id;
	await req.groupPathRepository.findById(groupPathId);

	return new SuccessResponse("Test passed", {
		user: req.userRepository.getRecord([
			EUSER_KEYS.ID,
			EUSER_KEYS.NAME,
			EUSER_KEYS.EMAIL,
			EUSER_KEYS.PROFILE_PIC_URL,
		]),
		groupsNames,
		size: req.groupPathRepository.getRecord([
			EGROUP_PATH_KEYS.SIZE_USED,
			EGROUP_PATH_KEYS.SIZE_MAX,
		]),
	}).send(res);
};
