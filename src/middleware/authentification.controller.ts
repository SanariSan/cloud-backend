import { NextFunction, Response } from "express";
import { AccessTokenError, AuthFailureError, JWT, TokenExpiredError } from "../core";
import { EUSER_RELATIONS } from "../database/connection";
import { getToken, validateTokenData } from "../helpers";
import { ProtectedRequest } from "../types-global";

const Authentificate = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const accessToken = getToken(req.headers.authorization);

	try {
		const accessTokenPayload = await JWT.validate(accessToken);
		validateTokenData(accessTokenPayload);

		let user = await req.userRepository
			.findById(accessTokenPayload.sub, [
				EUSER_RELATIONS.KEYSTORE,
				EUSER_RELATIONS.GROUPS_PARTICIPATE,
				EUSER_RELATIONS.GROUP_OWNAGE,
				EUSER_RELATIONS.USER_PRIVELEGE,
			])
			.then((_) => _.getRecord());
		if (!user) throw new AuthFailureError("User not registered");

		let keystore = await req.keystoreRepository
			.findByToken(accessTokenPayload.prm)
			.then((_) => _.getRecord());
		if (!keystore) throw new AuthFailureError("Invalid access token");

		req.accessTokenPayload = accessTokenPayload;
		return next();
	} catch (e) {
		if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
		throw e;
	}
};

export { Authentificate };
