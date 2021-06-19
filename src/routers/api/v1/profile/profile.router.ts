import { Router } from "express";
import { ProfileInfo } from "../../../../controllers/profile";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";

const ProfileRouter = Router();

ProfileRouter.get(
	"/info",
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(ProfileInfo),
);

export { ProfileRouter };
