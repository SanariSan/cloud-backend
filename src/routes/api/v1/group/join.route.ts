import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../../types";
import { AuthFailureError, BadRequestError, SuccessResponse } from "../../../../core";
import bcrypt from "bcrypt";
import { GROUP_RELATIONS } from "../../../../database";

// req.body === {groupId: id, password: string, }
export const GroupJoin = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//search for target group
	await req.groupRepository.findById(req.body.groupId, [GROUP_RELATIONS.USERS_PARTICIPATE]);

	//if found - get record
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	//check pass
	const matchPass: boolean = await bcrypt.compare(req.body.password, groupRecord.password);
	if (!matchPass) throw new AuthFailureError("Authentication failure");

	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	//check if user already in group
	const participants = groupRecord.usersParticipate;
	if (participants.some((user) => user.id === userRecord.id))
		throw new BadRequestError("You are already in this group");

	//add target group's record to user's groups list
	await req.userRepository.addGroupParticipance(groupRecord).saveRecord();

	//add user's record to target group's users list
	await req.groupRepository.addUser(userRecord).saveRecord();

	return new SuccessResponse("Group join successful", {
		group: req.groupRepository.getRecord(["id", "name"]),
	}).send(res);
};
