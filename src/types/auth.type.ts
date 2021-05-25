import { Request } from "express";
import { GroupRepository, KeystoreRepository, UserRepository } from "../database";

export interface PreparedRequest extends Request {
    userRepository: UserRepository;
    keystoreRepository: KeystoreRepository;
    groupRepository: GroupRepository;
}

export interface ProtectedRequest extends PreparedRequest {
    accessToken?: string;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
