import bcrypt from "bcrypt";
import { NextFunction, Response } from "express";
import { BadRequestError, SuccessMsgResponse } from "../../core";
import { ProtectedRequest } from "../../types-global";

// req.body === {oldPassword: string, newPassword: string, }
export const AccessChangePassword = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
) => {
	//get user record if exists
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	//compare sended password with existing one
	const matchPass = await bcrypt.compare(req.body.oldPassword, userRecord.password);
	if (!matchPass) throw new BadRequestError("Wrong password");

	//set new password
	const newPassword = await bcrypt.hash(req.body.newPassword, 12);
	await req.userRepository.setPassword(newPassword).saveRecord();

	//get all keystores ids
	const userKeystoresIds = userRecord.keystore.map((el) => el.id);

	//remove all keystore records if any exists, relation to user's records removes automatically
	await req.keystoreRepository.findByIds(userKeystoresIds);
	const keystoreRecords = req.keystoreRepository.getRecords();

	if (keystoreRecords && keystoreRecords.length !== 0)
		await req.keystoreRepository.removeRecords();

	return new SuccessMsgResponse("Password changed, login again").send(res);
};
