import { Request, Response, NextFunction, Router } from "express";
import { AsyncHandle } from "../../../../helpers";
import { validate } from "../../../../helpers";
import { schema } from "./access.schema";
import { Login } from "./login.route";
import { Register } from "./register.route";

const AccessRouter = Router();

// ProfileRouter.get(
//     "/",
//     // validate
//     // etc,
//     AsyncHandle(Profile),
// );

AccessRouter.post("/register", validate(schema.signup), AsyncHandle(Register));
AccessRouter.post("/login", validate(schema.userCredential), AsyncHandle(Login));

// ProfileRouter.post("/1", validate(schema.userCredential), AsyncHandle(Profile1));
// ProfileRouter.get("/2", AsyncHandle(Profile2));
// ProfileRouter.get("/3", AsyncHandle(Profile3));
// ProfileRouter.get("/4", AsyncHandle(Profile4));
// ProfileRouter.get("/5", AsyncHandle(Profile5));
// ProfileRouter.get("/6", AsyncHandle(Profile6));
// ProfileRouter.get("/7", AsyncHandle(Profile7));

export { AccessRouter };
