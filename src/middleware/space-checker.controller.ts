import { ProtectedRequest } from "../types";
import { EGROUP_RELATIONS } from "../database";
import { InternalError, NoSpaceError } from "../core";
import getItemSize from "get-folder-size";
import config from "config";
import path from "path";

const storageDir = <string>config.get("storageDirectory");

const UpdateSpace = async (req: ProtectedRequest): Promise<any> => {
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

	if (groupPathRecord.sizeUsed >= groupPathRecord.sizeMax) {
		throw new NoSpaceError();
	}
};

export { UpdateSpace };
