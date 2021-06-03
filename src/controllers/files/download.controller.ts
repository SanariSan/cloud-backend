import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../types";
import { checkExists, SendFileResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database";
import { handleFs } from "../../helpers";
import path from "path";

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

	return new SendFileResponse({
		filePath: path.join(groupPathRecord.pathName, req.params.path, req.params.filename),
		filename: req.params.filename,
	}).send(res);
};
