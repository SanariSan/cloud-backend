import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { BadRequestError, SuccessMsgResponse } from "../../core";
import { GROUP_RELATIONS } from "../../database";

// req.body.send === string
// req.body === groupId (group to leave form)
export const Leave = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	await req.groupRepository.findById(req.body.groupId, [GROUP_RELATIONS.USERS_PARTICIPATE]);

	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	if (!groupRecord.usersParticipate.some((el) => el.id === userRecord.id))
		throw new BadRequestError("You are not in this group");

	if (userRecord.groupOwnage.id === req.body.groupId)
		throw new BadRequestError(
			"You are owner of this group. Owners can't leave their own groups.",
		);

	await req.groupRepository.removeUser(userRecord).saveRecord();

	return new SuccessMsgResponse(`You just left group ${groupRecord.name}`).send(res);
};
