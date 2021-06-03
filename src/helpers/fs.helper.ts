import { ProtectedRequest } from "../types";
import { EGROUP_RELATIONS } from "../database";
import { InternalError, NoSpaceError, BadRequestError } from "../core";
import getItemSize from "get-folder-size";
import config from "config";
import path from "path";
import { NextFunction } from "express";

const storageDir = <string>config.get("storageDirectory");

export const handleFs = (execution: Function) => (arg: any) =>
	execution(arg).catch((err) => {
		if (err && err.code === "ENOENT") {
			//not found
			throw new BadRequestError("No such directory");
		}
		if (err && err.code === "ENOTDIR") {
			//path to file, not dir
			throw new BadRequestError("Expected directory, got file instead");
		}
		if (err && err.code === "EEXIST") {
			//entity already exists
			throw new BadRequestError(
				"Object you are trying to create has already been created before",
			);
		}

		throw err;
	});

export const UpdateSpace = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	await req.groupRepository.findById(parseInt(req.params.groupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	let dirSize;
	let i = 0;
	while (true) {
		let err = false;

		dirSize = await getItemSize
			.strict(path.join(storageDir, groupPathRecord.pathName))
			.catch((e) => {
				err = true;
			});

		if (err === false) {
			break;
		}

		if (i >= 3 && err === true) {
			throw new InternalError();
		}

		i++;
	}

	await req.groupPathRepository.updateSizeUsed(dirSize).saveRecord();

	// next();
	// if (groupPathRecord.sizeUsed >= groupPathRecord.sizeMax) {
	// 	throw new NoSpaceError();
	// }
};