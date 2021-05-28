import { Router } from "express";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../controllers";
import { GroupCreate } from "./create.route";
import { GroupSearchByName } from "./search-by-name.route";
import { GroupSearchByEmail } from "./search-by-email.route";
import { GroupJoin } from "./join.route";
import { GroupLeave } from "./leave.route";
import { GroupChangePassword } from "./change-password.route";

const GroupRouter = Router();

GroupRouter.post(
	"/create",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupCreate),
);
GroupRouter.post(
	"/join",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupJoin),
);
GroupRouter.post(
	"/leave",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupLeave),
);
GroupRouter.post(
	"/change-password",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupChangePassword),
);
GroupRouter.post(
	"/search-by-name",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupSearchByName),
);
GroupRouter.post(
	"/search-by-email",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupSearchByEmail),
);

export { GroupRouter };
