import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../types";
import { BadRequestError, SuccessMsgResponse } from "../../../core";
import {
	calculateCurrentStorageSize,
	returnSomeResponseToPaymentService,
	validatePaymentServiceToken,
} from "../../../helpers";
import config from "config";
import { EGROUP_RELATIONS, EUSER_PRIVELEGE_RELATIONS } from "../../../database";

// req.body === { someUserInfo }
export const Add500 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
	//no actual payment logic implemented, just showcase purpose
	// if (!validatePaymentServiceToken(req.body.token)) throw new Error();
	// returnSomeResponseToPaymentService("someData");
	//...

	const userRecord = req.userRepository.getRecord();
	if (!userRecord) throw new Error();
	if (!userRecord.groupOwnage) throw new BadRequestError("You don't own any groups");
	if (!userRecord.userPrivelege) throw new Error();

	await req.userPrivelegeRepository.findById(userRecord.userPrivelege.id, [
		EUSER_PRIVELEGE_RELATIONS.PRIVELEGE_100,
		EUSER_PRIVELEGE_RELATIONS.PRIVELEGE_500,
	]);
	const userPrivelegeRecord = req.userPrivelegeRepository.getRecord();
	if (!userPrivelegeRecord) throw new Error();

	await req.privelege500Repository.createPrivelege500().saveRecord();
	const privelege500Record = req.privelege500Repository.getRecord();
	if (!privelege500Record) throw new Error();

	await req.userPrivelegeRepository.addPrivelege500(privelege500Record).saveRecord();

	await req.groupRepository.findById(userRecord.groupOwnage.id, [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	//part with size updating
	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const defaultSizeMax = <number>config.get("privelege.defaultStorageSizeGb");
	const updatedSizeMax = await calculateCurrentStorageSize(
		req.userRepository,
		req.userPrivelegeRepository,
	);
	await req.groupPathRepository.updateSizeMax(defaultSizeMax, updatedSizeMax).saveRecord();

	return new SuccessMsgResponse("Success").send(res);
};
