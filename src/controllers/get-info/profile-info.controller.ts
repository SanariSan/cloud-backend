import { NextFunction, Response } from "express";
import { SuccessResponse } from "../../core";
import {
	EGROUP_KEYS,
	EGROUP_PATH_KEYS,
	EGROUP_RELATIONS,
	EUSER_KEYS,
} from "../../database/connection";
import { ProtectedRequest } from "../../types-global";

export const ProfileInfo = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	let groupsList: Array<{ id: number; name: string } | void> = [];
	if (userRecord.groupsParticipate)
		groupsList = userRecord.groupsParticipate.map((el) => ({ id: el.id, name: el.name }));

	//userRecord.groupOwnage === null
	if (userRecord.groupOwnage) {
		await req.groupRepository.findById(userRecord.groupOwnage.id, [
			EGROUP_RELATIONS.GROUP_PATH,
		]);
	}
	const groupRecord = req.groupRepository.getRecord();

	let groupPathRecord;
	if (groupRecord) {
		await req.groupPathRepository.findById(groupRecord.groupPath.id);
		groupPathRecord = req.groupPathRepository.getRecord();
		if (!groupPathRecord) throw new Error();
	}

	return new SuccessResponse("Profile info", {
		user: req.userRepository.getRecord([
			EUSER_KEYS.ID,
			EUSER_KEYS.NAME,
			EUSER_KEYS.EMAIL,
			EUSER_KEYS.PROFILE_PIC_URL,
		]),
		groupsList,
		groupOwnage: userRecord.groupOwnage
			? req.groupRepository.getRecord([EGROUP_KEYS.ID])
			: null,
		storageInfo: groupPathRecord
			? req.groupPathRepository.getRecord([
					EGROUP_PATH_KEYS.SIZE_USED,
					EGROUP_PATH_KEYS.SIZE_MAX,
			  ])
			: null,
	}).send(res);
};
