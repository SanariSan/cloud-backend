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

export enum ENTITIES {
	USER = "User",
	USER_PRIVELEGE = "UserPrivelege",
	KEYSTORE = "Keystore",
	GROUP = "Group",
	GROUP_PATH = "GroupPath",
	PRIVELEGE_100 = "Privelege100",
	PRIVELEGE_500 = "Privelege500",
}

//-----------------------------------------

export enum EUSER_KEYS {
	ID = "id",
	NAME = "name",
	EMAIL = "email",
	PASSWORD = "password",
	PROFILE_PIC_URL = "profilePicUrl",
	GROUP_OWNAGE = "groupOwnage",
	USER_PRIVELEGE = "userPrivelege",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	KEYSTORE = "keystore",
	GROUPS_PARTICIPATE = "groupsParticipate",
}

export enum EUSER_RELATIONS {
	USER_PRIVELEGE = "userPrivelege",
	GROUP_OWNAGE = "groupOwnage",
	KEYSTORE = "keystore",
	GROUPS_PARTICIPATE = "groupsParticipate",
}

//-----------------------------------------

export enum EKEYSTORE_KEYS {
	ID = "id",
	ACCESS_TOKEN_KEY = "accessTokenKey",
	REFRESH_TOKEN_KEY = "refreshTokenKey",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	USER = "user",
}

export enum EKEYSTORE_RELATIONS {
	USER = "user",
}

//-----------------------------------------

export enum EGROUP_KEYS {
	ID = "id",
	NAME = "name",
	PASSWORD = "password",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	GROUP_PATH = "groupPath",
	USERS_PARTICIPATE = "usersParticipate",
}

export enum EGROUP_RELATIONS {
	GROUP_PATH = "groupPath",
	USERS_PARTICIPATE = "usersParticipate",
}

//-----------------------------------------

export enum EGROUP_PATH_KEYS {
	ID = "id",
	PATH_NAME = "pathName",
	SIZE_MAX = "sizeMax",
	SIZE_USED = "sizeUsed",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
}

export enum EGROUP_PATH_RELATIONS { // big oof
	UNDEFINED = "undefined",
}

//-----------------------------------------

export enum EUSER_PRIVELEGE_KEYS {
	ID = "id",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	PRIVELEGE_100 = "privelege100",
	PRIVELEGE_500 = "privelege500",
}

export enum EUSER_PRIVELEGE_RELATIONS {
	PRIVELEGE_100 = "privelege100",
	PRIVELEGE_500 = "privelege500",
}

//-----------------------------------------

export enum EPRIVELEGE_100_KEYS {
	ID = "id",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	USER_PRIVELEGE = "userPrivelege",
}

export enum EPRIVELEGE_100_RELATIONS {
	USER_PRIVELEGE = "userPrivelege",
}

//-----------------------------------------

export enum EPRIVELEGE_500_KEYS {
	ID = "id",
	CREATED_AT = "createdAt",
	UPDATED_AT = "updatedAt",
	USER_PRIVELEGE = "userPrivelege",
}

export enum EPRIVELEGE_500_RELATIONS {
	USER_PRIVELEGE = "userPrivelege",
}

//-----------------------------------------

export type TEntities =
	| ENTITIES.USER
	| ENTITIES.KEYSTORE
	| ENTITIES.GROUP
	| ENTITIES.USER_PRIVELEGE
	| ENTITIES.PRIVELEGE_100
	| ENTITIES.PRIVELEGE_500
	| ENTITIES.GROUP_PATH;

export type TModels =
	| User
	| Keystore
	| Group
	| GroupPath
	| UserPrivelege
	| Privelege100
	| Privelege500;

export type TModelsKeys =
	| EUSER_KEYS
	| EKEYSTORE_KEYS
	| EGROUP_KEYS
	| EGROUP_PATH_KEYS
	| EUSER_PRIVELEGE_KEYS
	| EPRIVELEGE_100_KEYS
	| EPRIVELEGE_500_KEYS;

export type TModelsRelationsKeys =
	| EUSER_RELATIONS
	| EKEYSTORE_RELATIONS
	| EGROUP_RELATIONS
	| EGROUP_PATH_RELATIONS
	| EUSER_PRIVELEGE_RELATIONS
	| EPRIVELEGE_100_RELATIONS
	| EPRIVELEGE_500_RELATIONS;
