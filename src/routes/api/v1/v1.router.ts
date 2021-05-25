import { Router } from "express";
import { AccessRouter } from "./access";
import { ProfileRouter } from "./profile";

const V1 = Router();
V1.use("/access", AccessRouter);
V1.use("/profile", ProfileRouter);

export { V1 };
