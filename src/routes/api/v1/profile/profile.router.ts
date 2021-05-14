import { Profile, Profile1, Profile2, Profile3, Profile4, Profile5, Profile6, Profile7 } from "./profile.route";
import { Router } from "express";
import { AsyncHandle } from "../../../../helpers";

const ProfileRouter = Router();

// ProfileRouter.get(
//     "/",
//     // validate
//     // etc,
//     AsyncHandle(Profile),
// );
ProfileRouter.get("/", AsyncHandle(Profile));
ProfileRouter.get("/1", AsyncHandle(Profile1));
ProfileRouter.get("/2", AsyncHandle(Profile2));
ProfileRouter.get("/3", AsyncHandle(Profile3));
ProfileRouter.get("/4", AsyncHandle(Profile4));
ProfileRouter.get("/5", AsyncHandle(Profile5));
ProfileRouter.get("/6", AsyncHandle(Profile6));
ProfileRouter.get("/7", AsyncHandle(Profile7));

export { ProfileRouter };
