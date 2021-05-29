import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { AuthFailureError, BadRequestError, SuccessMsgResponse } from "../../core";
import bcrypt from "bcrypt";

// req.body === {oldPassword: string, newPassword: string, }
export const ChangePassword = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//get user record if exists and check for group ownage
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();
	if (!userRecord.groupOwnage) throw new BadRequestError("You don't own any groups.");

	//get group record if exists (always true because of check above)
	await req.groupRepository.findById(userRecord.groupOwnage.id);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	//compare sended password with existing one
	const matchPass = await bcrypt.compare(req.body.oldPassword, groupRecord.password);
	if (!matchPass) throw new AuthFailureError("Wrong password");

	//set new password
	const newPassword = await bcrypt.hash(req.body.newPassword, 12);
	await req.groupRepository.setPassword(newPassword).saveRecord();

	return new SuccessMsgResponse("Password changed").send(res);
};
