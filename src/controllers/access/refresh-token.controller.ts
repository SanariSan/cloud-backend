import { NextFunction, Response } from "express";
import { AuthFailureError, BadRequestError, JWT, SuccessResponse } from "../../core";
import { EUSER_RELATIONS } from "../../database/connection";
import { getToken, setNewTokenPair, validateTokenData } from "../../helpers";
import { ProtectedRequest } from "../../types-global";

export const AccessRefresh = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const accessTokenPayload = await JWT.validateNoExp(getToken(req.headers.authorization));
	validateTokenData(accessTokenPayload);
	const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
	validateTokenData(refreshTokenPayload);

	//not sure if it even possible
	if (accessTokenPayload.sub !== refreshTokenPayload.sub)
		throw new AuthFailureError("Access token holder mismatch");

	//get user's record if exists
	await req.userRepository.findById(accessTokenPayload.sub, [EUSER_RELATIONS.KEYSTORE]);
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new BadRequestError("User not registered");

	//get keystore if exists (not needed further, just for the check)
	await req.keystoreRepository.findByBothTokens(accessTokenPayload.prm, refreshTokenPayload.prm);
	const keystoreRecord = req.keystoreRepository.getRecord();
	if (!keystoreRecord) throw new BadRequestError("Token pair not found");

	//delete old expired pair
	await req.keystoreRepository.removeRecord();

	//create fresh new keystore, assign to user
	const tokens = await setNewTokenPair(req.userRepository, req.keystoreRepository);

	return new SuccessResponse("Token Issued", { tokens }).send(res);
};
