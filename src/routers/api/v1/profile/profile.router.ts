import { Router } from "express";
import { Profile1 } from "../../../../controllers/profile";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";

const ProfileRouter = Router();

ProfileRouter.post(
	"/1",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(Profile1),
);

export { ProfileRouter };
