export interface IUserManualInput {
	email: string;
	password: string;
}

//-----------------------------------------

export interface IKeystoreManualInput {
	accessTokenKey: string;
	refreshTokenKey: string;
}

//-----------------------------------------

export interface IGroupManualInput {
	name: string;
	password: string;
}

//-----------------------------------------

export interface IGroupPathManualInput {
	pathName: string;
	sizeMax: number;
	sizeUsed: number;
}

//-----------------------------------------

export interface IPrivelege100ManualInput {
	expiresIn: number;
}

//-----------------------------------------

export interface IPrivelege500ManualInput {
	expiresIn: number;
}

//-----------------------------------------
