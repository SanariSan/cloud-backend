// import * from "./access";
import { Router } from "express";
import { Profile } from "./profile";

const V1 = Router();
V1.use("/profile", Profile);

export { V1 };
