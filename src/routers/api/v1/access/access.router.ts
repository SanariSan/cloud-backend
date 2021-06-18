import { Router } from "express";
import {
	AccessChangePassword,
	AccessLogin,
	AccessLogout,
	AccessRefresh,
	AccessRegister,
} from "../../../../controllers/access";
import { Validate, ValidationSource } from "../../../../helpers";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import { Schema } from "./access.schema";

const AccessRouter = Router();

AccessRouter.post(
	"/register",
	Validate(Schema.signup, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(AccessRegister),
);
AccessRouter.post(
	"/login",
	Validate(Schema.login, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(AccessLogin),
);

AccessRouter.put(
	"/refresh",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.refresh, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(AccessRefresh),
);
AccessRouter.post(
	"/change-password",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.changePassword, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(AccessChangePassword),
);
AccessRouter.delete(
	"/logout",
	Validate(Schema.auth, ValidationSource.HEADER),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(AccessLogout),
);

export { AccessRouter };
