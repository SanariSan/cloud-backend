import { Router } from "express";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import { Validate, ValidationSource } from "../../../../helpers";
import {
	GroupCreate,
	GroupSearchByName,
	GroupSearchByEmail,
	GroupJoin,
	GroupLeave,
	GroupChangePassword,
} from "../../../../controllers/group";
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
GroupRouter.post("/leave", Validate(Schema.leave, ValidationSource.BODY), AsyncHandle(GroupLeave));
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

export { GroupRouter };
