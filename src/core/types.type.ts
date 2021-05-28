import { Response } from "express";

// Custom status codes map
export enum StatusCode {
	SUCCESS = "3000",
	FAILURE = "3001",
	INVALID_ACCESS_TOKEN = "3002",
}

// Response codes to custom names map
export enum ResponseStatus {
	SUCCESS = 200,
	CHUNK = 206,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500,
}

//Short statuses to full function issuer names map
export enum ErrorType {
	BAD_TOKEN = "BadTokenError",
	TOKEN_EXPIRED = "TokenExpiredError",
	UNAUTHORIZED = "AuthFailureError",
	ACCESS_TOKEN = "AccessTokenError",
	INTERNAL = "InternalError",
	NOT_FOUND = "NotFoundError",
	NO_ENTRY = "NoEntryError",
	NO_DATA = "NoDataError",
	BAD_REQUEST = "BadRequestError",
	FORBIDDEN = "ForbiddenError",
}

export type THttpCall = Response | Boolean;
