import { Router } from "express";
import {
	FilesDownload,
	FilesUpload,
	FoldersBrowse,
	FoldersCreate,
	FoldersFilesDelete,
	FoldersFilesRename,
} from "../../../../controllers/fs";
import { b64Decode, Validate, ValidationSource } from "../../../../helpers";
import {
	AsyncHandle,
	Authentificate,
	CheckGroupPermission,
	StickRepos,
	UpdateSpace,
} from "../../../../middleware";
import { Schema } from "./fs.schema";

const FilesRouter = Router({ mergeParams: true });

FilesRouter.param("groupId", (req, res, next, val) => {
	AsyncHandle(CheckGroupPermission)(req, res, next);
});

FilesRouter.param("path", (req, res, next, val) => {
	try {
		req.params.path = b64Decode(val) || req.params.path;
	} catch (e) {
		console.error(e);
	}
	next();
});

FilesRouter.param("filename", (req, res, next, val) => {
	try {
		req.params.filename = b64Decode(val) || req.params.filename;
	} catch (e) {
		console.log(e);
	}
	next();
});

FilesRouter.use(AsyncHandle(StickRepos), AsyncHandle(Authentificate));
FilesRouter.use(
	"/*/:groupId-:path{-:filename}?",
	Validate(Schema.auth, ValidationSource.HEADER),
	AsyncHandle(UpdateSpace),
);

FilesRouter.get(
	"/browse-folder/:groupId-:path",
	Validate(Schema.paramsShort, ValidationSource.PARAM),
	AsyncHandle(FoldersBrowse),
);
FilesRouter.get(
	"/download-file/:groupId-:path-:filename",
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(FilesDownload),
);
FilesRouter.post(
	"/upload-file/:groupId-:path-:filename",
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(FilesUpload),
);
FilesRouter.put(
	"/create-folder/:groupId-:path-:filename",
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(FoldersCreate),
);
FilesRouter.patch(
	"/rename-file-folder/:groupId-:path-:filename",
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(FoldersFilesRename),
);
FilesRouter.delete(
	"/delete-file-folder/:groupId-:path",
	Validate(Schema.paramsShort, ValidationSource.PARAM),
	AsyncHandle(FoldersFilesDelete),
);

export { FilesRouter };
