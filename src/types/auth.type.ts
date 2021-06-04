import { Request } from "express";
import { JwtPayload } from "../core";
import {
	GroupPathRepository,
	GroupRepository,
	KeystoreRepository,
	Privelege100Repository,
	Privelege500Repository,
	UserPrivelegeRepository,
	UserRepository,
} from "../database/repositories";

export interface PreparedRequest extends Request {
	userRepository: UserRepository;
	keystoreRepository: KeystoreRepository;
	groupRepository: GroupRepository;
	userPrivelegeRepository: UserPrivelegeRepository;
	groupPathRepository: GroupPathRepository;
	privelege100Repository: Privelege100Repository;
	privelege500Repository: Privelege500Repository;
}

export interface ProtectedRequest extends PreparedRequest {
	accessTokenPayload: JwtPayload;
}

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}
