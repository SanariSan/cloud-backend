import {
	User,
	Group,
	Keystore,
	GroupPath,
	UserPrivelege,
	Privelege100,
	Privelege500,
} from "../models";

//-----------------------------------------

export interface IUserManualInput {
	name: string;
	email: string;
	password: string;
	profilePicUrl: string;
}

export type TUserKeys =
	| "id"
	| "name"
	| "email"
	| "password"
	| "profilePicUrl"
	| "groupOwnage"
	| "userPrivelege"
	| "createdAt"
	| "updatedAt"
	| "keystore"
	| "groupsParticipate";

export enum USER_RELATIONS {
	USER_PRIVELEGE = "userPrivelege",
	GROUP_OWNAGE = "groupOwnage",
	KEYSTORE = "keystore",
	GROUPS_PARTICIPATE = "groupsParticipate",
}

//-----------------------------------------

export interface IKeystoreManualInput {
	accessTokenKey: string;
	refreshTokenKey: string;
}
export type TKeystoreKeys =
	| "id"
	| "accessTokenKey"
	| "refreshTokenKey"
	| "createdAt"
	| "updatedAt"
	| "user";

export enum KEYSTORE_RELATIONS {
	USER = "user",
}

//-----------------------------------------

export interface IGroupManualInput {
	name: string;
	password: string;
}
export type TGroupKeys =
	| "id"
	| "name"
	| "password"
	| "createdAt"
	| "updatedAt"
	| "groupPath"
	| "usersParticipate";

export enum GROUP_RELATIONS {
	GROUP_PATH = "groupPath",
	USERS_PARTICIPATE = "usersParticipate",
}

//-----------------------------------------

export interface IGroupPathManualInput {
	pathName: string;
	sizeMax: number;
	sizeUsed: number;
}

export type TGroupPathKeys = "id" | "pathName" | "sizeMax" | "sizeUsed" | "createdAt" | "updatedAt";

export enum GROUP_PATH_RELATIONS { // big oof
	UNDEFINED = "undefined",
}

//-----------------------------------------

export type TUserPrivelegeKeys = "id" | "createdAt" | "updatedAt" | "privelege100" | "privelege500";

export enum USER_PRIVELEGE_RELATIONS {
	PRIVELEGE_100 = "privelege100",
	PRIVELEGE_500 = "privelege500",
}

//-----------------------------------------

export interface IPrivelege100ManualInput {
	expiresIn: number;
}

export type TPrivelege100Keys = "id" | "createdAt" | "updatedAt" | "userPrivilege";

export enum PRIVELEGE_100_RELATIONS {
	USER_PRIVELEGE = "userPrivilege",
}

//-----------------------------------------

export interface IPrivelege500ManualInput {
	expiresIn: number;
}

export type TPrivelege500Keys = "id" | "createdAt" | "updatedAt" | "userPrivilege";

export enum PRIVELEGE_500_RELATIONS {
	USER_PRIVELEGE = "userPrivilege",
}

//-----------------------------------------

export type TModels =
	| User
	| Keystore
	| Group
	| GroupPath
	| UserPrivelege
	| Privelege100
	| Privelege500;
export type TModelsKeys =
	| TUserKeys
	| TKeystoreKeys
	| TGroupKeys
	| TGroupPathKeys
	| TUserPrivelegeKeys
	| TPrivelege100Keys
	| TPrivelege500Keys;
export type TModelsRelationsKeys =
	| USER_RELATIONS
	| KEYSTORE_RELATIONS
	| GROUP_RELATIONS
	| GROUP_PATH_RELATIONS
	| USER_PRIVELEGE_RELATIONS
	| PRIVELEGE_100_RELATIONS
	| PRIVELEGE_500_RELATIONS;
