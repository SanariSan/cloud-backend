import { Router } from "express";
import {
	AsyncHandle,
	Authentificate,
	StickRepos,
	CheckGroupPermission,
} from "../../../../middleware";
import { Validate, ValidationSource } from "../../../../helpers";
import { FilesDownload, FilesUpload } from "../../../../controllers/files";
import { Schema } from "./files.schema";

const FilesRouter = Router();

FilesRouter.post(
	"/*",
	Validate(Schema.auth, ValidationSource.HEADER),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	// AsyncHandle(CheckGroupPermission),
);

// FilesRouter.post(
// 	"/browse",
// 	Validate(Schema.browse, ValidationSource.BODY),
// 	AsyncHandle(FilesBrowse),
// );

FilesRouter.post(
	"/upload/:groupId-:path-:filename",
	// Validate(Schema.create, ValidationSource.BODY),
	AsyncHandle(FilesUpload),
);
FilesRouter.post(
	"/download/:groupId-:path-:filename",
	// Validate(Schema.create, ValidationSource.BODY),
	AsyncHandle(FilesDownload),
);
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
