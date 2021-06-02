import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { createFile, SuccessMsgResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database";
import { handleFs } from "../../helpers";

export const FilesUpload = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(parseInt(req.params.groupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	console.log(req.params);
	const createFileH = handleFs(createFile);
	await createFileH({
		userDir: groupPathRecord.pathName,
		pathA: req.params.path,
		pathB: req.params.filename,
		req,
	}).catch((err) => {
		throw err;
	});

	return new SuccessMsgResponse("OK"); //move to apiresponse
};
