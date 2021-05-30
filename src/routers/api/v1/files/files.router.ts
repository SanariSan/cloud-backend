import { Router } from "express";
import { AsyncHandle, Authentificate, StickRepos } from "../../../../middleware";
import { Validate, ValidationSource } from "../../../../helpers";
import {} from "../../../../controllers/files";
import { Schema } from "./files.schema";

const FilesRouter = Router();

// FilesRouter.post(
// 	"/*",
// 	Validate(Schema.auth, ValidationSource.HEADER),
// 	AsyncHandle(StickRepos),
// 	AsyncHandle(Authentificate),
// );

// FilesRouter.post(
// 	"/upload",
// 	Validate(Schema.create, ValidationSource.BODY),
// 	AsyncHandle(GroupCreate),
// );
// FilesRouter.post("/download", Validate(Schema.join, ValidationSource.BODY), AsyncHandle(GroupJoin));
// FilesRouter.post("/rename", Validate(Schema.leave, ValidationSource.BODY), AsyncHandle(GroupLeave));
// FilesRouter.post(
// 	"/move",
// 	Validate(Schema.changePassword, ValidationSource.BODY),
// 	AsyncHandle(GroupChangePassword),
// );
// FilesRouter.post(
// 	"/delete",
// 	Validate(Schema.searchByName, ValidationSource.BODY),
// 	AsyncHandle(GroupSearchByName),
// );

export { FilesRouter };
