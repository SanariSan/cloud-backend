import { Router } from "express";
import { ProfileRouter } from "./profile";
// import { AccessRouter } from "./profile";

const V1 = Router();
V1.use("/profile", ProfileRouter);

export { V1 };
