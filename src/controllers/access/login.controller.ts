import { Response, NextFunction } from "express";
import { SuccessResponse, BadRequestError, AuthFailureError } from "../../core";
import { setNewTokenPair } from "../../helpers";
import { EUSER_RELATIONS, EUSER_KEYS } from "../../database";
import { PreparedRequest } from "../../types";
import bcrypt from "bcrypt";

export const Login = async (req: PreparedRequest, res: Response, next: NextFunction) => {
	await req.userRepository.findByEmail(req.body.email, [EUSER_RELATIONS.KEYSTORE]);

	//get user's record if exists
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new BadRequestError("User not registered");

	//compare pass
	const matchPass: boolean = await bcrypt.compare(req.body.password, userRecord.password);
	if (!matchPass) throw new AuthFailureError("Wrong password");

	//create new keystore, save it and assign relation to user's record
	const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);

	return new SuccessResponse("Login Success", {
		user: req.userRepository.getRecord([
			EUSER_KEYS.ID,
			EUSER_KEYS.NAME,
			EUSER_KEYS.EMAIL,
			EUSER_KEYS.PROFILE_PIC_URL,
		]),
		tokens: tokens,
	}).send(res);
};
