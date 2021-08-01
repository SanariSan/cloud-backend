import { NextFunction, Response } from "express";
import { readFolder, SuccessResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database/connection";
import { b64Encode, handleFs } from "../../helpers";
import { ProtectedRequest } from "../../types-global";

// req.params === groupId: string, path: string
export const FoldersBrowse = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//get user record if exists and check for group ownage
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(parseInt(req.params.groupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const dirEntites: {
		files: Array<string>;
		folders: Array<string>;
	} = await handleFs(readFolder)({
		userDir: groupPathRecord.pathName,
		pathA: req.params.path,
	});

	const decodedDirEntites = {
		files: dirEntites.files.map(b64Encode),
		folders: dirEntites.folders.map(b64Encode),
	};

	return new SuccessResponse("Directory content", decodedDirEntites).send(res);
};
