import { Router } from "express";
import { validate, asyncHandle, ValidationSource } from "../../../../helpers";
import { Authentificate } from "../../../../controllers";
import { Schema } from "./access.schema";
import { Login } from "./login.route";
import { Logout } from "./logout.route";
import { Refresh } from "./refresh-token.route";
import { Register } from "./register.route";

const AccessRouter = Router();

AccessRouter.post("/register", validate(Schema.signup, ValidationSource.BODY), asyncHandle(Register));
AccessRouter.post("/login", validate(Schema.userCredential, ValidationSource.BODY), asyncHandle(Login));
AccessRouter.post(
    "/refresh",
    validate(Schema.auth, ValidationSource.HEADER),
    validate(Schema.refreshToken, ValidationSource.BODY),
    asyncHandle(Refresh),
);
//todo add change password + move asyncHandle(Authentificate)
AccessRouter.delete(
    "/logout",
    validate(Schema.auth, ValidationSource.HEADER),
    asyncHandle(Authentificate),
    asyncHandle(Logout),
);

export { AccessRouter };