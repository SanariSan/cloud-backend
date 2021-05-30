import { Router } from "express";
import { Validate, ValidationSource } from "../../../../helpers";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import {
	AccessLogin,
	AccessLogout,
	AccessRefresh,
	AccessRegister,
	AccessChangePassword,
} from "../../../../controllers/access";
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

AccessRouter.put("/*", Validate(Schema.auth, ValidationSource.HEADER));

AccessRouter.put(
	"/refresh",
	Validate(Schema.refresh, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(AccessRefresh),
);
AccessRouter.post(
	"/change-password",
	Validate(Schema.changePassword, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(AccessChangePassword),
);
AccessRouter.delete(
	"/logout",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(AccessLogout),
);

export { AccessRouter };
