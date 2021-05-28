import { Response, NextFunction } from "express";
import { SuccessMsgResponse } from "../../core";
import { ProtectedRequest } from "../../types";

export const Logout = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//remove keystore record, relation to user's records removes automatically
	await req.keystoreRepository.removeRecord();

	return new SuccessMsgResponse("Logout success").send(res);
};
