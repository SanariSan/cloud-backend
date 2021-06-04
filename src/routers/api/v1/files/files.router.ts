import { Router } from "express";
import { Validate, ValidationSource } from "../../../../helpers";
import { UpdateSpace } from "../../../../middleware";
import { Schema } from "./files.schema";
import {
	AsyncHandle,
	Authentificate,
	StickRepos,
	CheckGroupPermission,
} from "../../../../middleware";
import {
	FilesDownload,
	FilesUpload,
	FoldersBrowse,
	FoldersCreate,
	FoldersFilesDelete,
	FoldersFilesRename,
} from "../../../../controllers/files";

const FilesRouter = Router();

FilesRouter.post(
	"/*",
	Validate(Schema.auth, ValidationSource.HEADER),
	Validate(Schema.params, ValidationSource.PARAM),
	AsyncHandle(StickRepos),
	AsyncHandle(Authentificate),
	AsyncHandle(CheckGroupPermission),
	AsyncHandle(UpdateSpace),
);

FilesRouter.get("/browse/:groupId-:path", AsyncHandle(FoldersBrowse));
FilesRouter.get("/download/:groupId-:path-:filename", AsyncHandle(FilesDownload));
FilesRouter.post("/upload/:groupId-:path-:filename", AsyncHandle(FilesUpload));
FilesRouter.put("/create/:groupId-:path-:filename", AsyncHandle(FoldersCreate));
FilesRouter.patch("/rename/:groupId-:path-:filename", AsyncHandle(FoldersFilesRename));
FilesRouter.delete("/delete/:groupId-:path-:filename", AsyncHandle(FoldersFilesDelete));
//add move

export { FilesRouter };
