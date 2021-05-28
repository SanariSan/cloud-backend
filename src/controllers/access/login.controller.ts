import { Response, NextFunction } from "express";
import { SuccessResponse, BadRequestError, AuthFailureError } from "../../core";
import { setNewTokenPair } from "../../helpers";
import { USER_RELATIONS } from "../../database";
import { PreparedRequest } from "../../types";
import bcrypt from "bcrypt";

export const Login = async (req: PreparedRequest, res: Response, next: NextFunction) => {
	await req.userRepository.findByEmail(req.body.email, [USER_RELATIONS.KEYSTORE]);

	//get user's record if exists
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new BadRequestError("User not registered");

	//compare pass
	const matchPass: boolean = await bcrypt.compare(req.body.password, userRecord.password);
	if (!matchPass) throw new AuthFailureError("Authentication failure");

	//create new keystore, save it and assign relation to user's record
	const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);

	return new SuccessResponse("Login Success", {
		user: req.userRepository.getRecord(["id", "name", "email", "profilePicUrl"]),
		tokens: tokens,
	}).send(res);
};
