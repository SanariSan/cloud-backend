import { NextFunction, Response } from "express";
import { createFile, NoSpaceError, SuccessMsgResponse } from "../../core";
import { EGROUP_RELATIONS } from "../../database/connection";
import { handleFs } from "../../helpers";
import { ProtectedRequest } from "../../types-global";

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
	const sizeIncomingMb = sizeIncoming / 1000 / 1000;
	if (sizeIncomingMb + groupPathRecord.sizeUsed > groupPathRecord.sizeMax) {
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

	return new SuccessMsgResponse(`Success`).send(res);
};
