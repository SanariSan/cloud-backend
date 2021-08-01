import { NextFunction, Response } from "express";
import { renameFileFolder, SuccessMsgResponse, SuccessResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database/connection";
import { handleFs } from "../../helpers";
import { ProtectedRequest } from "../../types-global";

// req.params === groupId: string, path: string, filename: string
export const FoldersFilesRename = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(parseInt(req.params.groupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	//mark untracked
	await req.groupPathRepository.setTracked(false).saveRecord();

	await handleFs(renameFileFolder)({
		userDir: groupPathRecord.pathName,
		pathA: req.params.path,
		pathB: req.params.filename,
	});

	return new SuccessMsgResponse("Success").send(res);
};
