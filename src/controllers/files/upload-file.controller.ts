import { Response, NextFunction } from "express";
import { createFile, NoSpaceError, SuccessMsgResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database/connection";
import { ProtectedRequest } from "../../types";
import { handleFs } from "../../helpers";

// req.params === groupId: string, path: string, filename: string
export const FilesUpload = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(parseInt(req.params.groupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const sizeIncoming = parseInt(<string>req.headers["content-length"]);
	const sizeIncomingGb = sizeIncoming / 1024 / 1024 / 1024;
	if (sizeIncomingGb + groupPathRecord.sizeUsed > groupPathRecord.sizeMax) {
		throw new NoSpaceError();
	}

	await handleFs(createFile)({
		userDir: groupPathRecord.pathName,
		pathA: req.params.path,
		pathB: req.params.filename,
		req,
	});

	//mark to calculate size later
	await req.groupPathRepository.setTracked(false).saveRecord();

	return new SuccessMsgResponse(`File '${req.params.filename}' uploaded successfully`).send(res);
};
