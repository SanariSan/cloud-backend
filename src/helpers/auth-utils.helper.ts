import crypto from "crypto";
import { AuthFailureError, InternalError, JWT, JwtPayload } from "../core";
import { KeystoreRepository, UserRepository } from "../database/repositories";
import { Tokens } from "../types-global";

const { accessTokenValidDays, refreshTokenValidDays, issuer, audience } = {
	accessTokenValidDays: parseInt(<string>process.env.ACCESS_TOKEN_VALID_DAYS),
	refreshTokenValidDays: parseInt(<string>process.env.REFRESH_TOKEN_VALID_DAYS),
	issuer: <string>process.env.ISSUER,
	audience: <string>process.env.AUDIENCE,
};

async function createTokens(
	userId: number,
	accessTokenKey: string,
	refreshTokenKey: string,
): Promise<Tokens> {
	const accessToken = await JWT.encode(
		new JwtPayload(issuer, audience, userId, accessTokenKey, accessTokenValidDays),
	);
	const refreshToken = await JWT.encode(
		new JwtPayload(issuer, audience, userId, refreshTokenKey, refreshTokenValidDays),
	);

	if (!accessToken) throw new InternalError();
	if (!refreshToken) throw new InternalError();

	return <Tokens>{
		accessToken,
		refreshToken,
	};
}

export function validateTokenData(payload: JwtPayload): boolean {
	if (
		!payload ||
		!payload.iss ||
		!payload.sub ||
		!payload.aud ||
		!payload.prm ||
		payload.iss !== issuer ||
		payload.aud !== audience
	)
		throw new AuthFailureError("Invalid Access Token");
	return true;
}

export function getToken(authorization?: string) {
	if (!authorization) throw new AuthFailureError("Invalid Authorization");
	if (!authorization.startsWith("Bearer ")) throw new AuthFailureError("Invalid Authorization");
	return authorization.split(" ")[1];
}

export async function setNewTokenPair(
	userRepository: UserRepository,
	keystoreRepository: KeystoreRepository,
): Promise<Tokens> {
	const accessTokenKey = crypto.randomBytes(64).toString("hex");
	const refreshTokenKey = crypto.randomBytes(64).toString("hex");

	await keystoreRepository.createKeystore({ accessTokenKey, refreshTokenKey }).saveRecord();

	const keystoreRecord = keystoreRepository.getRecord();
	if (!keystoreRecord) throw new Error();

	await userRepository.addKeystore(keystoreRecord).saveRecord();

	const userRecord = userRepository.getRecord();
	if (!userRecord) throw new Error();

	const tokens = await createTokens(
		userRecord.id,
		keystoreRecord.accessTokenKey,
		keystoreRecord.refreshTokenKey,
	);
	return tokens;
}
