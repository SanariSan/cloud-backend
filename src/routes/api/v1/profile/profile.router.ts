import { Profile1 } from "./profile.route";
import { Router } from "express";
import { asyncHandle } from "../../../../helpers";
import { Authentificate } from "../../../../controllers";

const ProfileRouter = Router();

ProfileRouter.use("/", asyncHandle(Authentificate));
ProfileRouter.post("/1", asyncHandle(Profile1));

export { ProfileRouter };
