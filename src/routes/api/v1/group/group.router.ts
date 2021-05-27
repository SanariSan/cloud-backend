import { Router } from "express";
import { asyncHandle } from "../../../../helpers";
import { Authentificate, StickRepos } from "../../../../controllers";
import { GroupCreate } from "./create.route";
import { GroupSearchByName } from "./search-by-name.route";
import { GroupSearchByEmail } from "./search-by-email.route";
import { GroupJoin } from "./join.route";
import { GroupLeave } from "./leave.route";
import { GroupChangePassword } from "./change-password.route";

const GroupRouter = Router();

GroupRouter.post("/create", asyncHandle(StickRepos), asyncHandle(Authentificate), asyncHandle(GroupCreate));
GroupRouter.post("/join", asyncHandle(StickRepos), asyncHandle(Authentificate), asyncHandle(GroupJoin));
GroupRouter.post("/leave", asyncHandle(StickRepos), asyncHandle(Authentificate), asyncHandle(GroupLeave));
GroupRouter.post(
    "/change-password",
    asyncHandle(StickRepos),
    asyncHandle(Authentificate),
    asyncHandle(GroupChangePassword),
);
GroupRouter.post(
    "/search-by-name",
    asyncHandle(StickRepos),
    asyncHandle(Authentificate),
    asyncHandle(GroupSearchByName),
);
GroupRouter.post(
    "/search-by-email",
    asyncHandle(StickRepos),
    asyncHandle(Authentificate),
    asyncHandle(GroupSearchByEmail),
);

export { GroupRouter };
