import { Router } from "express";
import { Validate, ValidationSource } from "../../../../helpers";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../controllers";
import { Schema } from "./access.schema";
import { Login } from "./login.route";
import { Logout } from "./logout.route";
import { Refresh } from "./refresh-token.route";
import { Register } from "./register.route";

const AccessRouter = Router();

AccessRouter.post(
	"/register",
	Validate(Schema.signup, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Register),
);
AccessRouter.post(
	"/login",
	Validate(Schema.userCredential, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Login),
);
AccessRouter.put(
	"/refresh",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.refreshToken, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Refresh),
);
//todo add change password + move asyncHandle(Authentificate) POST bcs also deleting all old tokens
AccessRouter.delete(
	"/logout",
	Validate(Schema.auth, ValidationSource.HEADER),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Logout),
);

export { AccessRouter };
