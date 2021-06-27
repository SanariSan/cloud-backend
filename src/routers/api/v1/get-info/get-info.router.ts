import { Router } from "express";
import { ProfileInfo } from "../../../../controllers/get-info";
import { GroupInfo } from "../../../../controllers/get-info/groups-info.controller";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";

const GetInfoRouter = Router();

GetInfoRouter.get(
	"/info-profile",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(ProfileInfo),
);

GetInfoRouter.post(
	"/info-group",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(GroupInfo),
);

export { GetInfoRouter };
