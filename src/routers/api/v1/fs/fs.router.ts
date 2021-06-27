import { Router } from "express";
import {
	FilesDownload,
	FilesUpload,
	FoldersBrowse,
	FoldersCreate,
	FoldersFilesDelete,
	FoldersFilesRename,
} from "../../../../controllers/fs";
import { Validate, ValidationSource } from "../../../../helpers";
import {
	AsyncHandle,
	Authentificate,
	CheckGroupPermission,
	StickRepos,
	UpdateSpace,
} from "../../../../middleware";
import { Schema } from "./fs.schema";

const FilesRouter = Router();

FilesRouter.get(
	"/browse-folder/:groupId-:path",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.paramsShort, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
	AsyncHandle(FoldersBrowse),
);

FilesRouter.get(
	"/download-file/:groupId-:path-:filename",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
	AsyncHandle(FilesDownload),
);
FilesRouter.post(
	"/upload-file/:groupId-:path-:filename",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
	AsyncHandle(FilesUpload),
);
FilesRouter.put(
	"/create-folder/:groupId-:path-:filename",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
	AsyncHandle(FoldersCreate),
);
FilesRouter.patch(
	"/rename-file-folder/:groupId-:path-:filename",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.paramsActions, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
	AsyncHandle(FoldersFilesRename),
);
FilesRouter.delete(
	"/delete-file-folder/:groupId-:path",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.paramsShort, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
	AsyncHandle(FoldersFilesDelete),
);

export { FilesRouter };
