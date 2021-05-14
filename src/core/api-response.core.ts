import { Response } from "express";

// Custom status codes map
enum StatusCode {
    SUCCESS = "3000",
    FAILURE = "3001",
    INVALID_ACCESS_TOKEN = "3002",
}

// Response codes to custom names map
enum ResponseStatus {
    SUCCESS = 200,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
    protected statusCode: StatusCode;
    protected status?: ResponseStatus;
    protected message: string;

    constructor(statusCode, status, message) {
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
    }

    protected prepare<T extends ApiResponse>(res: Response, newResponseData: T): Response {
        return res.status(<number>newResponseData.status).json(ApiResponse.sanitize<T>(newResponseData));
    }

    public send(res: Response): Response {
        return this.prepare<ApiResponse>(res, this);
    }

    private static sanitize<T extends ApiResponse>(newResponseData: T): T {
        const clone: T = <T>{};
        Object.assign(clone, newResponseData);
        //response body now has statusCode, status, message from ApiResponse + internal fields
        //so we want to delete all the fields we don't want to send to the client
        delete clone.status;
        // for (const i in clone) if (typeof clone[i] === "undefined") delete clone[i];
        return clone;
    }
}

export class AuthFailureResponse extends ApiResponse {
    constructor(message = "Authentication Failure") {
        super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
    }
}

export class NotFoundResponse extends ApiResponse {
    public url: string;

    constructor(message = "Not Found") {
        super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
        this.url = "";
    }

    //reimplementing send method to include url field from express res obj
    send(res: Response): Response {
        // including path we could not find
        if (res.req) this.url = res.req.originalUrl;
        return super.prepare<NotFoundResponse>(res, this);
    }
}

export class ForbiddenResponse extends ApiResponse {
    constructor(message = "Forbidden") {
        super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
    }
}

export class BadRequestResponse extends ApiResponse {
    constructor(message = "Bad Parameters") {
        super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
    }
}

export class InternalErrorResponse extends ApiResponse {
    constructor(message = "Internal Error") {
        super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
    }
}

export class SuccessMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
    }
}

export class FailureMsgResponse extends ApiResponse {
    constructor(message: string) {
        super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
    }
}

export class SuccessResponse<T> extends ApiResponse {
    private data: T;

    constructor(message: string, data) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
        this.data = data;
    }

    //reimplementing send method to pass new field type (data) to generic
    send(res: Response): Response {
        return super.prepare<SuccessResponse<T>>(res, this);
    }
}

// find where used
export class AccessTokenErrorResponse extends ApiResponse {
    constructor(message = "Access token invalid") {
        super(StatusCode.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
    }

    //reimplementing send method to include unusual header
    send(res: Response): Response {
        res.setHeader("instruction", "refresh_token");
        return super.prepare<AccessTokenErrorResponse>(res, this);
    }
}

export class TokenRefreshResponse extends ApiResponse {
    private accessToken: string;
    private refreshToken: string;

    constructor(message: string, accessToken, refreshToken) {
        super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    //reimplementing send method to pass new fields types (tokens) to generic
    send(res: Response): Response {
        return super.prepare<TokenRefreshResponse>(res, this);
    }
}
