import { Response } from "express";
import { ResponseStatus, StatusCode, THttpCall } from "./types.type";

abstract class ApiResponse {
	protected abstract statusCode: StatusCode;
	protected abstract status?: ResponseStatus;
	protected abstract message: string;

	protected constructor() {}

	protected abstract prepare<T extends ApiResponse>(res: Response, newResponseData: T): THttpCall;
	public abstract send(res: Response): THttpCall;
	protected static sanitize<T extends ApiResponse>(newResponseData: T): T {
		const clone: T = <T>{};
		Object.assign(clone, newResponseData);
		//response body now has statusCode, status, message from ApiResponse + internal fields of instance class
		//so we want to delete all the fields we don't want to send to the client
		delete clone.status;
		return clone;
	}
}

class SingleApiResponse extends ApiResponse {
	protected statusCode: StatusCode;
	protected status?: ResponseStatus;
	protected message: string;

	protected constructor(statusCode, status, message) {
		super();

		this.statusCode = statusCode;
		this.status = status;
		this.message = message;
	}

	protected prepare<T extends ApiResponse>(res: Response, newResponseData: T): THttpCall {
		return res.status(<number>this.status).json(ApiResponse.sanitize<T>(newResponseData));
	}

	public send(res: Response): THttpCall {
		return this.prepare<ApiResponse>(res, this);
	}
}

class StreamApiResponse extends ApiResponse {
	protected statusCode: StatusCode;
	protected status?: ResponseStatus;
	protected message: string;

	protected constructor(statusCode, status, message) {
		super();

		this.statusCode = statusCode;
		this.status = status;
		this.message = message;
	}

	protected prepare<T extends ApiResponse>(res: Response, newResponseData: T): THttpCall {
		res.status(<number>this.status);
		//@ts-ignore
		if (!newResponseData.last) {
			res.write(StreamApiResponse.sanitize<T>(newResponseData));
		} else {
			res.end();
		}

		return res;
	}

	public send(res: Response): THttpCall {
		return this.prepare<ApiResponse>(res, this);
	}

	protected static sanitize<T extends ApiResponse>(newResponseData: T): T {
		// const clone: T = <T>{};
		// Object.assign(clone, newResponseData);
		//@ts-ignore
		return newResponseData.data;
	}
}

export class AuthFailureResponse extends SingleApiResponse {
	constructor(message = "Authentication Failure") {
		super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
	}
}

export class NotFoundResponse extends SingleApiResponse {
	public url?: string;

	constructor(message = "Not Found") {
		super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
	}

	//reimplementing send method to include url field from express res obj
	public send(res: Response): THttpCall {
		// including path we could not find (if invoked for path)
		if (res.req) this.url = res.req.originalUrl;
		return super.prepare<NotFoundResponse>(res, this);
	}
}

export class BadRequestResponse extends SingleApiResponse {
	constructor(message = "Bad Parameters") {
		super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
	}
}

export class InternalErrorResponse extends SingleApiResponse {
	constructor(message = "Internal Error") {
		super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
	}
}

//not used
// export class FailureMsgResponse extends SingleApiResponse {
//     constructor(message: string) {
//         super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
//     }
// }

export class AccessTokenErrorResponse extends SingleApiResponse {
	constructor(message = "Access token invalid") {
		super(StatusCode.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
	}

	//reimplementing send method to include unusual header
	public send(res: Response): THttpCall {
		res.setHeader("instruction", "refresh_token");
		return super.prepare<AccessTokenErrorResponse>(res, this);
	}
}

export class TokenRefreshResponse extends SingleApiResponse {
	private accessToken: string;
	private refreshToken: string;

	constructor(message: string, accessToken, refreshToken) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
	}

	//reimplementing send method to pass new fields types (tokens) to generic
	public send(res: Response): THttpCall {
		return super.prepare<TokenRefreshResponse>(res, this);
	}
}

export class SuccessMsgResponse extends SingleApiResponse {
	constructor(message: string) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
	}
}

export class SuccessResponse<T> extends SingleApiResponse {
	private data: T;

	constructor(message: string, data) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
		this.data = data;
	}

	//reimplementing send method to pass new field type (data) to generic
	public send(res: Response): THttpCall {
		return super.prepare<SuccessResponse<T>>(res, this);
	}
}

export class StreamResponse<T> extends StreamApiResponse {
	private data: T;

	constructor(message: string, data, last: Boolean = false) {
		super(StatusCode.SUCCESS, last ? ResponseStatus.SUCCESS : ResponseStatus.CHUNK, message);
		this.data = data;
	}

	//reimplementing send method to pass new field type (data) to generic
	public send(res: Response): THttpCall {
		return super.prepare<StreamResponse<T>>(res, this);
	}
}
