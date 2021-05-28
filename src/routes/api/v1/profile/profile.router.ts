import { Router } from "express";
import { Profile1 } from "./profile.route";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../controllers";

const ProfileRouter = Router();

ProfileRouter.post(
	"/1",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Profile1),
);

export { ProfileRouter };
