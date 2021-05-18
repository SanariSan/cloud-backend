// import User from '../database/model/User';
// import Keystore from '../database/model/Keystore';
import { Request } from "express";

export interface ProtectedRequest extends Request {
    user?: any;
    accessToken?: string;
    keystore?: any;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}
