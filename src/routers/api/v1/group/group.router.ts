import { Router } from "express";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import { Validate, ValidationSource } from "../../../../helpers";
import {
	Create,
	SearchByName,
	SearchByEmail,
	Join,
	Leave,
	ChangePassword,
} from "../../../../controllers/group";
import { Schema } from "./group.schema";

const GroupRouter = Router();

GroupRouter.post(
	"/",
	Validate(Schema.auth, ValidationSource.HEADER),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
);
GroupRouter.post("/create", Validate(Schema.create, ValidationSource.BODY), AsyncHandle(Create));
GroupRouter.post("/join", Validate(Schema.join, ValidationSource.BODY), AsyncHandle(Join));
GroupRouter.post("/leave", Validate(Schema.leave, ValidationSource.BODY), AsyncHandle(Leave));
GroupRouter.post(
	"/change-password",
	Validate(Schema.changePassword, ValidationSource.BODY),
	AsyncHandle(ChangePassword),
);
GroupRouter.post(
	"/search-by-name",
	Validate(Schema.searchByName, ValidationSource.BODY),
	AsyncHandle(SearchByName),
);
GroupRouter.post(
	"/search-by-email",
	Validate(Schema.searchByEmail, ValidationSource.BODY),
	AsyncHandle(SearchByEmail),
);

export { GroupRouter };
