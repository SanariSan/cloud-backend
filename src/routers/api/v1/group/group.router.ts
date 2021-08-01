import { Router } from "express";
import {
	AddSpace100,
	AddSpace500,
	GroupChangePassword,
	GroupCreate,
	GroupJoin,
	GroupSearchByEmail,
	GroupSearchByName,
} from "../../../../controllers/group";
import { GroupKick } from "../../../../controllers/group/kick.controller";
import { Validate, ValidationSource } from "../../../../helpers";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import { Schema } from "./group.schema";

const GroupRouter = Router();

GroupRouter.post(
	"/*",
	Validate(Schema.auth, ValidationSource.HEADER),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
);
GroupRouter.post(
	"/create",
	Validate(Schema.create, ValidationSource.BODY),
	AsyncHandle(GroupCreate),
);
GroupRouter.post("/join", Validate(Schema.join, ValidationSource.BODY), AsyncHandle(GroupJoin));
GroupRouter.post("/kick", Validate(Schema.kick, ValidationSource.BODY), AsyncHandle(GroupKick));
GroupRouter.post(
	"/change-password",
	Validate(Schema.changePassword, ValidationSource.BODY),
	AsyncHandle(GroupChangePassword),
);
GroupRouter.post(
	"/search-by-name",
	Validate(Schema.searchByName, ValidationSource.BODY),
	AsyncHandle(GroupSearchByName),
);
GroupRouter.post(
	"/search-by-email",
	Validate(Schema.searchByEmail, ValidationSource.BODY),
	AsyncHandle(GroupSearchByEmail),
);
GroupRouter.post(
	"/add100",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(AddSpace100),
);
GroupRouter.post(
	"/add500",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(AddSpace500),
);

export { GroupRouter };
