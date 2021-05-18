import { Router } from "express";
import { validate, asyncHandle } from "../../../../helpers";
import { Schema } from "./access.schema";
import { Login } from "./login.route";
import { Register } from "./register.route";

const AccessRouter = Router();

AccessRouter.post("/register", validate(Schema.signup), asyncHandle(Register));
AccessRouter.post("/login", validate(Schema.userCredential), asyncHandle(Login));

export { AccessRouter };
