import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { SuccessResponse } from "../../core";
import { EUSER_KEYS } from "../../database";

export const Profile1 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const groupsUserIn = req.userRepository.getRecord();
	if (!groupsUserIn) throw new Error();

	let groupsNames: Array<string> = [];
	if (groupsUserIn.groupsParticipate)
		groupsNames = groupsUserIn.groupsParticipate.map((el) => el.name);

	return new SuccessResponse("Test passed", {
		user: req.userRepository.getRecord([
			EUSER_KEYS.ID,
			EUSER_KEYS.NAME,
			EUSER_KEYS.EMAIL,
			EUSER_KEYS.PROFILE_PIC_URL,
		]),
		groupsNames,
	}).send(res);
};
