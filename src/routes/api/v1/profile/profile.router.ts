import { Profile1 } from "./profile.route";
import { Router } from "express";
import { asyncHandle } from "../../../../helpers";
import { Authentificate } from "../../../../controllers";
import { StickRepos } from "../../../../controllers/repositories-sticker.controller";

const ProfileRouter = Router();

ProfileRouter.post("/1", asyncHandle(StickRepos), asyncHandle(Authentificate), asyncHandle(Profile1));

export { ProfileRouter };
