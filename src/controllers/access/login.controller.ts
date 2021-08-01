import bcrypt from "bcrypt";
import { NextFunction, Response } from "express";
import { BadRequestError, SuccessResponse } from "../../core";
import { EUSER_KEYS, EUSER_RELATIONS } from "../../database/connection";
import { setNewTokenPair } from "../../helpers";
import { PreparedRequest } from "../../types-global";

export const AccessLogin = async (req: PreparedRequest, res: Response, next: NextFunction) => {
	//get user's record if exists
	await req.userRepository.findByEmail(req.body.email, [EUSER_RELATIONS.KEYSTORE]);
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new BadRequestError("User not registered");

	//compare pass
	const matchPass: boolean = await bcrypt.compare(req.body.password, userRecord.password);
	if (!matchPass) throw new BadRequestError("Wrong password");

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
