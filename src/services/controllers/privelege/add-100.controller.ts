import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../types";
import { BadRequestError, SuccessMsgResponse } from "../../../core";
import {
	calculateCurrentStorageSize,
	returnSomeResponseToPaymentService,
	validatePaymentServiceToken,
} from "../../../helpers";
import config from "config";
import { EGROUP_RELATIONS } from "../../../database";

// req.body === { someUserInfo }
export const Add100 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//no actual payment logic implemented, just showcase purpose
	if (!validatePaymentServiceToken(req.body.token)) throw new Error();
	returnSomeResponseToPaymentService("someData");
	//...

	await req.userPrivelegeRepository.createUserPrivelege().saveRecord();
	await req.privelege100Repository.createPrivelege100().saveRecord();

	const privelege100Record = req.privelege100Repository.getRecord();
	if (!privelege100Record) throw new Error();

	await req.userPrivelegeRepository.addPrivelege100(privelege100Record).saveRecord();

	const userPrivelegeRecord = req.userPrivelegeRepository.getRecord();
	if (!userPrivelegeRecord) throw new Error();

	await req.userRepository.addUserPrivelege(userPrivelegeRecord).saveRecord();

	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();
	if (!userRecord.groupOwnage) throw new BadRequestError("You don't own any groups");

	await req.groupRepository.findById(userRecord.groupOwnage.id, [EGROUP_RELATIONS.GROUP_PATH]);

	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	//part with size updating
	const groupPathId = groupRecord.groupPath.id;
	await req.groupPathRepository.findById(groupPathId);

	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const updatedSizeMax = await calculateCurrentStorageSize(
		req.userRepository,
		req.userPrivelegeRepository,
	);
	await req.groupPathRepository
		.updateSizeMax(config.get("privelege.defaultStorageSizeGb"), updatedSizeMax)
		.saveRecord();

	return new SuccessMsgResponse("Success").send(res);
};
