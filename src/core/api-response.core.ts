import { Response } from "express";
import { ObjectLiteral } from "typeorm";
import { ResponseStatus, StatusCode, THttpCall } from "./types.type";

//-------------------------------
//Abstract parent

abstract class ApiResponseAbstract {
	protected abstract statusCode: StatusCode;
	protected abstract status?: ResponseStatus;
	protected abstract message: string;
	protected abstract body:
		| string
		| { statusCode: StatusCode; message: string; data: ObjectLiteral }
		| any;

	protected constructor() {}

	protected abstract setStatus(res: Response): this;
	protected abstract sanitize(): this;
	protected abstract finish(res: Response): THttpCall;
	protected abstract chainCaller(res: Response): THttpCall;
	public abstract send(res: Response): THttpCall;
}

//------------------------------
//Parents for response classes

class ApiResponse extends ApiResponseAbstract {
	protected statusCode: StatusCode;
	protected status?: ResponseStatus;
	protected message: string;
	protected body: any;

	protected constructor(statusCode, status, message) {
		super();

		this.statusCode = statusCode;
		this.status = status;
		this.message = message;
		this.body = {};
	}

	protected setStatus(res: Response): this {
		res.status(<number>this.status);
		return this;
	}

	//response body now has statusCode, status, message from ApiResponse + internal fields of child class
	//so we want to clone fields to body and delete all that we don't want to send to the client
	protected sanitize() {
		Object.assign(this.body, this);
		//avoiding circular dependency since this has body in it, so we are getting ref*
		delete this.body.body;
		//this field only needs to be used in setStatus, not including into body
		delete this.body.status;

		return this;
	}

	protected finish(res: Response): THttpCall {
		return res.send(this.body);
	}

	protected chainCaller(res: Response): THttpCall {
		return this.setStatus(res).sanitize().finish(res);
	}

	public send(res: Response): THttpCall {
		return this.chainCaller(res);
	}
}

class SingleApiResponse extends ApiResponse {
	protected constructor(statusCode, status, message) {
		super(statusCode, status, message);
	}

	protected finish(res: Response): THttpCall {
		return res.json(this.body);
	}
}

class StreamApiResponse extends ApiResponse {
	protected lastPiece?: boolean;

	protected constructor(statusCode, status, message, lastPiece) {
		super(statusCode, status, message);

		this.lastPiece = lastPiece;
	}

	protected sanitize(): this {
		this.body = this.message;

		return this;
	}

	protected finish(res: Response): THttpCall {
		if (!this.lastPiece) {
			res.write(this.body);
		} else {
			res.end();
		}

		return res;
	}
}

//-------------------------------
//Error response childs

export class AuthFailureResponse extends SingleApiResponse {
	constructor(message = "Authentication Failure") {
		super(StatusCode.FAILURE, ResponseStatus.UNAUTHORIZED, message);
	}
}

export class ForbiddenResponse extends SingleApiResponse {
	constructor(message = "Forbidden") {
		super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
	}
}

export class NotFoundResponse extends SingleApiResponse {
	protected url?: string;

	constructor(message = "Not Found") {
		super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
	}

	protected addFields(res: Response): this {
		// including path we could not find (if invoked for path)
		if (res.req) this.url = res.req.originalUrl;
		return this;
	}

	//reimplementing send method to modify this object
	public send(res: Response): THttpCall {
		return this.addFields(res).chainCaller(res);
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

export class AccessTokenErrorResponse extends SingleApiResponse {
	constructor(message = "Access token invalid") {
		super(StatusCode.INVALID_ACCESS_TOKEN, ResponseStatus.UNAUTHORIZED, message);
	}
}

//-------------------------------
//Success response childs

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
}

export class StreamResponse extends StreamApiResponse {
	constructor(message: string, lastPiece: Boolean = false) {
		super(
			StatusCode.SUCCESS,
			lastPiece ? ResponseStatus.SUCCESS : ResponseStatus.CHUNK,
			message,
			lastPiece,
		);
	}
}
