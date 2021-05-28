import { Response, NextFunction } from "express";
import { setNewTokenPair } from "../../helpers";
import { BadRequestError, SuccessResponse } from "../../core";
import { PreparedRequest } from "../../types";
import { EUSER_KEYS } from "../../database";
import bcrypt from "bcrypt";

export const Register = async (req: PreparedRequest, res: Response, next: NextFunction) => {
	await req.userRepository.findByEmail(req.body.email);

	const userRecord = req.userRepository.getRecord();
	if (userRecord) throw new BadRequestError("User already registered");

	const newUser = {
		name: req.body.name,
		email: req.body.email,
		profilePicUrl: req.body.profilePicUrl,
		password: await bcrypt.hash(req.body.password, 12),
	};
	await req.userRepository.createUser(newUser).saveRecord();

	//create new keystore pair, assign to the user
	const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);

	return new SuccessResponse("Signup Successful", {
		user: req.userRepository.getRecord([
			EUSER_KEYS.ID,
			EUSER_KEYS.NAME,
			EUSER_KEYS.EMAIL,
			EUSER_KEYS.PROFILE_PIC_URL,
		]),
		tokens: tokens,
	}).send(res);
};
