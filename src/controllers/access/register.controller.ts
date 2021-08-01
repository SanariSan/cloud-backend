import bcrypt from "bcrypt";
import { NextFunction, Response } from "express";
import { BadRequestError, SuccessResponse } from "../../core";
import { EUSER_KEYS } from "../../database/connection";
import { setNewTokenPair } from "../../helpers";
import { PreparedRequest } from "../../types-global";

export const AccessRegister = async (req: PreparedRequest, res: Response, next: NextFunction) => {
	//get user record if exists, throw err cuz of register
	await req.userRepository.findByEmail(req.body.email);
	const userRecord = req.userRepository.getRecord();
	if (userRecord) throw new BadRequestError("User already registered");

	//create new user obj
	const newUser = {
		email: req.body.email,
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
