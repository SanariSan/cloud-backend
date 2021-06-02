import { Router } from "express";
import { AccessRouter } from "./access";
import { FilesRouter } from "./files";
import { GroupRouter } from "./group";
import { ProfileRouter } from "./profile";

const V1 = Router();

V1.use("/access", AccessRouter);
V1.use("/profile", ProfileRouter);
V1.use("/group", GroupRouter);
V1.use("/files", FilesRouter);

export { V1 };
