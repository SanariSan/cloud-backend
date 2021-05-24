import { Router } from "express";
import { AccessRouter } from "./access";
import { ProfileRouter } from "./profile";
// import { AccessRouter } from "./profile";

const V1 = Router();
V1.use("/profile", ProfileRouter);
V1.use("/access", AccessRouter);

export { V1 };
