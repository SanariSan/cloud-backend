// import * from "./access";
import { Router } from "express";
import { Profile } from "./profile";

const routesV1 = Router();
routesV1.use("/profile", Profile);

export { routesV1 };
