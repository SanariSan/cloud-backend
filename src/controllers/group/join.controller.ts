import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { AuthFailureError, BadRequestError, SuccessResponse } from "../../core";
import { EGROUP_KEYS, EGROUP_RELATIONS } from "../../database";
import bcrypt from "bcrypt";

// req.body === {groupId: id, password: string, }
export const Join = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//get group record if exists
	await req.groupRepository.findById(req.body.groupId, [EGROUP_RELATIONS.USERS_PARTICIPATE]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new BadRequestError("Requested group not found");

	//check pass
	const matchPass: boolean = await bcrypt.compare(req.body.password, groupRecord.password);
	if (!matchPass) throw new AuthFailureError("Authentication failure");

	//get user record if exists
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	//check if user already in group
	const participants = groupRecord.usersParticipate;
	if (participants.some((user) => user.id === userRecord.id))
		throw new BadRequestError("You are already in this group");

	//add target group's record to user's groups list
	await req.userRepository.addGroupParticipance(groupRecord).saveRecord();
	//add user's record to target group's users list
	await req.groupRepository.addParticipant(userRecord).saveRecord();

	return new SuccessResponse("Group join successful", {
		group: req.groupRepository.getRecord([EGROUP_KEYS.ID, EGROUP_KEYS.NAME]),
	}).send(res);
};
