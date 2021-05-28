import { Router } from "express";
import { Validate, ValidationSource } from "../../../../helpers";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import { Login, Logout, Refresh, Register, ChangePassword } from "../../../../controllers/access";
import { Schema } from "./access.schema";

const AccessRouter = Router();

AccessRouter.post(
	"/register",
	Validate(Schema.signup, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Register),
);
AccessRouter.post(
	"/login",
	Validate(Schema.login, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Login),
);

AccessRouter.put("/", Validate(Schema.auth, ValidationSource.HEADER));
AccessRouter.put(
	"/refresh",
	Validate(Schema.refresh, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Refresh),
);
AccessRouter.post(
	"/change-password",
	Validate(Schema.changePassword, ValidationSource.BODY),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(ChangePassword),
);
AccessRouter.delete(
	"/logout",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Logout),
);

export { AccessRouter };
