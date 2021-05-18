import { Profile1 } from "./profile.route";
import { Request, Response, NextFunction, Router } from "express";
import { asyncHandle, ValidationSource } from "../../../../helpers";
import { validate } from "../../../../helpers";
import { schema } from "./profile.schema";
import { Authentificate } from "../../../../middleware";

const ProfileRouter = Router();

// ProfileRouter.get(
//     "/",
//     // validate
//     // etc,
//     AsyncHandle(Profile),
// );
// ProfileRouter.get("/", asyncHandle(Profile));
ProfileRouter.use("/", Authentificate);
ProfileRouter.post("/1", asyncHandle(Profile1));
// ProfileRouter.get("/2", asyncHandle(Profile2));
// ProfileRouter.get("/3", asyncHandle(Profile3));
// ProfileRouter.get("/4", asyncHandle(Profile4));
// ProfileRouter.get("/5", asyncHandle(Profile5));
// ProfileRouter.get("/6", asyncHandle(Profile6));
// ProfileRouter.get("/7", asyncHandle(Profile7));

export { ProfileRouter };
