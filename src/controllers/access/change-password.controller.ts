import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { AuthFailureError, SuccessMsgResponse } from "../../core";
import bcrypt from "bcrypt";

// req.body === {oldPassword: string, newPassword: string, }
export const ChangePassword = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	const matchPass = await bcrypt.compare(req.body.oldPassword, userRecord.password);
	if (!matchPass) throw new AuthFailureError("Wrong password");

	const newPassword = await bcrypt.hash(req.body.newPassword, 12);
	await req.userRepository.setPassword(newPassword).saveRecord();

	//remove all keystore records, relation to user's records removes automatically
	const userKeystoresIds = userRecord.keystore.map((el) => el.id);
	await req.keystoreRepository.removeRecords(userKeystoresIds);

	return new SuccessMsgResponse("Password changed, login again").send(res);
};
