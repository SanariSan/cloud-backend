import { NextFunction, Response } from "express";
import path from "path";
import { checkExists, SendFileResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database/connection";
import { handleFs } from "../../helpers";
import { ProtectedRequest } from "../../types-global";

// req.params === groupId: string, path: string, filename: string
export const FilesDownload = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(parseInt(req.params.groupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	await handleFs(checkExists)({
		userDir: groupPathRecord.pathName,
		pathA: req.params.path,
		pathB: req.params.filename,
	});

	//mark to calculate size later
	await req.groupPathRepository.setTracked(false).saveRecord();

	return new SendFileResponse({
		filePath: path.join(groupPathRecord.pathName, req.params.path, req.params.filename),
		filename: req.params.filename,
	}).send(res);
};
