//importing all errors responses
import {
    AuthFailureResponse,
    AccessTokenErrorResponse,
    InternalErrorResponse,
    NotFoundResponse,
    BadRequestResponse,
    Logger,
} from "../core";
import { Response } from "express";
import { ErrorType, THttpCall } from "./types.type";
import config from "config";

const environment = config.get("environment");

export class ApiError extends Error {
    constructor(public type: ErrorType, public message: string = "error") {
        super(type);
    }

    public static handle<T extends ApiError>(err: T, res: Response): THttpCall {
        switch (err.type) {
            case ErrorType.BAD_TOKEN:
            case ErrorType.TOKEN_EXPIRED:
            case ErrorType.UNAUTHORIZED:
                Logger.error(err.message); //add fields from res such as pwd, token, etc...
                return new AuthFailureResponse(err.message).send(res);
            case ErrorType.ACCESS_TOKEN:
                Logger.error(err.message);
                return new AccessTokenErrorResponse(err.message).send(res);
            case ErrorType.INTERNAL:
                Logger.error(err.message);
                return new InternalErrorResponse(err.message).send(res);
            case ErrorType.NOT_FOUND:
            case ErrorType.NO_ENTRY:
                Logger.error(err.message);
                return new NotFoundResponse(err.message).send(res);
            case ErrorType.BAD_REQUEST:
                Logger.error(err.message);
                return new BadRequestResponse(err.message).send(res);
            default: {
                let message = err.message;
                Logger.warn(message);

                // Don't send failure message in production as it may contain sensitive data
                if (environment === "production") message = "Something wrong happened.";
                return new InternalErrorResponse(message).send(res);
            }
        }
    }
}

export class AuthFailureError extends ApiError {
    constructor(message = "Invalid Credentials") {
        super(ErrorType.UNAUTHORIZED, message);
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
