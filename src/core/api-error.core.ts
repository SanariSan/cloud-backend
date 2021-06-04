import { Response } from "express";
//importing all errors responses
import {
	AccessTokenErrorResponse,
	AuthFailureResponse,
	BadRequestResponse,
	ForbiddenResponse,
	InternalErrorResponse,
	NoSpaceErrorResponse,
	NotFoundResponse,
} from "./api-response.core";
import { Logger } from "./logger.core";
import { ErrorType, THttpCall } from "./types.type";

export class ApiError extends Error {
	constructor(public type: ErrorType, public message: string = "error") {
		super(type);
	}

	public static handle<T extends ApiError>(err: T, res: Response): THttpCall {
		Logger.error(err.message); //add fields from res such as pwd, token, etc...

		switch (err.type) {
			case ErrorType.BAD_TOKEN:
			case ErrorType.TOKEN_EXPIRED:
			case ErrorType.UNAUTHORIZED:
				return new AuthFailureResponse(err.message).send(res);
			case ErrorType.FORBIDDEN:
				return new ForbiddenResponse(err.message).send(res);
			case ErrorType.ACCESS_TOKEN:
				return new AccessTokenErrorResponse(err.message).send(res);
			case ErrorType.INTERNAL:
				return new InternalErrorResponse(err.message).send(res);
			case ErrorType.NOT_FOUND:
			case ErrorType.NO_ENTRY:
				return new NotFoundResponse(err.message).send(res);
			case ErrorType.BAD_REQUEST:
				return new BadRequestResponse(err.message).send(res);
			case ErrorType.NO_SPACE:
				return new NoSpaceErrorResponse(err.message).send(res);
			default: {
				Logger.warn(err.message);

				return new InternalErrorResponse("Something went wrong.").send(res);
			}
		}
	}
}

export class AuthFailureError extends ApiError {
	constructor(message = "Invalid Credentials") {
		super(ErrorType.UNAUTHORIZED, message);
	}
}

export class AuthorizationError extends ApiError {
	constructor(message = "No permission") {
		super(ErrorType.FORBIDDEN, message);
	}
}

export class InternalError extends ApiError {
	constructor(message = "Internal error") {
		super(ErrorType.INTERNAL, message);
	}
}

export class BadRequestError extends ApiError {
	constructor(message = "Bad Request") {
		super(ErrorType.BAD_REQUEST, message);
	}
}

export class NotFoundError extends ApiError {
	constructor(message = "Not Found") {
		super(ErrorType.NOT_FOUND, message);
	}
}
//for user info/songo info
export class NoEntryError extends ApiError {
	constructor(message = "Entry don't exists") {
		super(ErrorType.NO_ENTRY, message);
	}
}

export class BadTokenError extends ApiError {
	constructor(message = "Token is not valid") {
		super(ErrorType.BAD_TOKEN, message);
	}
}

export class TokenExpiredError extends ApiError {
	constructor(message = "Token is expired") {
		super(ErrorType.TOKEN_EXPIRED, message);
	}
}

export class AccessTokenError extends ApiError {
	constructor(message = "Invalid access token") {
		super(ErrorType.ACCESS_TOKEN, message);
	}
}

export class NoSpaceError extends ApiError {
	constructor(message = "Not enough free space") {
		super(ErrorType.NO_SPACE, message);
	}
}
