import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../types";
import { EGROUP_RELATIONS } from "../database/connection";
import { InternalError } from "../core";
import { calculateCurrentMaxStorageSize } from "../helpers";
import getItemSize from "get-folder-size";
import config from "config";
import path from "path";

const storageDir = <string>config.get("storageDirectory");

export const UpdateSpace = async (
	req: ProtectedRequest,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();

	let targetGroupId;

	if (req.params && req.params.groupId) {
		targetGroupId = req.params.groupId;
	} else if (req.body && req.body.groupId) {
		targetGroupId = req.body.groupId;
	} else {
		targetGroupId = userRecord.groupOwnage;
	}

	await req.groupRepository.findById(parseInt(targetGroupId), [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	//------------------------------

	if (groupPathRecord.tracked === true) {
		return next();
	}

	//-------------------------------

	const updatedSizeMax = await calculateCurrentMaxStorageSize(
		req.userRepository,
		req.userPrivelegeRepository,
	);
	await req.groupPathRepository.updateSizeMax(updatedSizeMax).saveRecord();

	//-------------------------------

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

	await req.groupPathRepository.updateSizeUsed(dirSize).setTracked(true).saveRecord();

	next();
};
