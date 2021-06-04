import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { BadRequestError, SuccessMsgResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database/connection";

// req.body.send === string
// req.body === groupId (group to leave form)
export const GroupLeave = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	//get group record if exists
	await req.groupRepository.findById(req.body.groupId, [EGROUP_RELATIONS.USERS_PARTICIPATE]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new BadRequestError("Requested group not found");

	//check if user in this group
	if (!groupRecord.usersParticipate.some((el) => el.id === userRecord.id))
		throw new BadRequestError("You are not in this group");

	//check if user is the owner of the group
	if (userRecord.groupOwnage.id === parseInt(req.body.groupId))
		throw new BadRequestError(
			"You are owner of this group. Owners can't leave their own groups.",
		);

	//remove user from group participants list
	await req.groupRepository.removeParticipant(userRecord).saveRecord();
	//remove group from list of groups user participate in
	await req.userRepository.removeGroupParticipance(groupRecord).saveRecord();

	return new SuccessMsgResponse(`You just left group ${groupRecord.name}`).send(res);
};
