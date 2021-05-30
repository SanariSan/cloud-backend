import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { BadRequestError, SuccessResponse } from "../../core";
import {
	EGROUP_KEYS,
	EGROUP_PATH_KEYS,
	IGroupManualInput,
	IGroupPathManualInput,
} from "../../database";
import bcrypt from "bcrypt";
import config from "config";

//req.body === {groupName: string, password: string}
export const GroupCreate = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//get user's record
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();
	if (userRecord.groupOwnage) throw new BadRequestError("You already have group");

	//initialize new group and path objects
	const newGroup: IGroupManualInput = {
		name: req.body.groupName,
		password: await bcrypt.hash(req.body.password, 12),
	};
	const newGroupPath: IGroupPathManualInput = {
		pathName: userRecord.email,
		sizeUsed: 0,
		sizeMax: config.get("privelege.defaultStorageSizeGb"),
	};

	//create group record
	await req.groupRepository.createGroup(newGroup).saveRecord();
	//create group path record
	await req.groupPathRepository.createGroupPath(newGroupPath).saveRecord();

	//check if records exist, if so - get them
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	//add empty priveleges record for later purchases
	await req.userPrivelegeRepository.createUserPrivelege().saveRecord();
	const userPrivelegeRecord = req.userPrivelegeRepository.getRecord();
	if (!userPrivelegeRecord) throw new Error();

	//XXXXXXXX!!!!!!!!!!!!?????XXXXXXXX
	//await helper.fs = create directory(req.groupPathRepository.getRecord().pathName)
	///???!!!!!!!!!!!!!!!!!!!!!

	//add all created info to relations listed below
	await req.userRepository
		.addGroupOwnage(groupRecord)
		.addGroupParticipance(groupRecord)
		.addUserPrivelege(userPrivelegeRecord)
		.saveRecord();

	//add user's record to group participants list + link path ownage
	await req.groupRepository
		.addParticipant(userRecord)
		.addPathOwnage(groupPathRecord)
		.saveRecord();

	return new SuccessResponse("Group created", {
		group: req.groupRepository.getRecord([EGROUP_KEYS.ID, EGROUP_KEYS.NAME]),
		size: req.groupPathRepository.getRecord([
			EGROUP_PATH_KEYS.ID,
			EGROUP_PATH_KEYS.SIZE_USED,
			EGROUP_PATH_KEYS.SIZE_MAX,
		]),
	}).send(res);
};
