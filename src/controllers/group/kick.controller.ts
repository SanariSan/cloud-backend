import { NextFunction, Response } from "express";
import { BadRequestError, SuccessMsgResponse } from "../../core";
import { EGROUP_RELATIONS, EUSER_RELATIONS } from "../../database/connection";
import { ProtectedRequest } from "../../types-global";

// req.body.send === string
// req.body === groupId, userId (group to leave form)
export const GroupKick = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	//get group record if exists
	await req.groupRepository.findById(req.body.groupId, [EGROUP_RELATIONS.USERS_PARTICIPATE]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new BadRequestError("Requested group not found");

	//check if user in this group
	if (!groupRecord.usersParticipate.some((el) => el.id === userRecord.id))
		throw new BadRequestError("You are not in this group");

	// USERID 3, GROUPID 3, groupId 3, userId 3
	// USERID 4, GROUPID 4, groupId 4, userId 3

	//check if owner if userRecord.id !== req.body.userId
	if (userRecord.id !== req.body.userId) {
		if (userRecord.groupOwnage.id !== parseInt(req.body.groupId))
			throw new BadRequestError("You are not the owner");

		//YES HE IS OWNER AND TARGETTING ANOTHER USER
	} else {
		//HE IS TARGETTING HIMSELF, CHECK IF HE IS THE OWNER
		if (userRecord.groupOwnage.id === parseInt(req.body.groupId))
			throw new BadRequestError(
				"You are owner of this group. Owners can't leave their own groups.",
			);

		//YES HE IS NOT THE OWNER AND TARGETTING HIMSELF
	}

	await req.userRepository.findById(req.body.userId, [
		EUSER_RELATIONS.GROUPS_PARTICIPATE,
		EUSER_RELATIONS.GROUP_OWNAGE,
	]);
	const userToKickRecord = req.userRepository.getRecord();
	if (!userToKickRecord) throw new BadRequestError("User is not in this group");

	//remove userToKickRecord from group participants list
	await req.groupRepository.removeParticipant(userToKickRecord).saveRecord();
	//remove group from list of groups user participate in
	await req.userRepository.removeGroupParticipance(groupRecord).saveRecord();

	return new SuccessMsgResponse(`You just kicked this user`).send(res);
};
