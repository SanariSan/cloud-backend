import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../types";
import { BadRequestError, SuccessMsgResponse } from "../../../core";
import { calculateCurrentMaxStorageSize } from "../../../helpers";
import { EGROUP_RELATIONS, EUSER_PRIVELEGE_RELATIONS } from "../../../database//connection";

// req.body === { someUserInfo }
export const Add100 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
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

	await req.privelege100Repository.createPrivelege100().saveRecord();
	const privelege100Record = req.privelege100Repository.getRecord();
	if (!privelege100Record) throw new Error();

	await req.userPrivelegeRepository.addPrivelege100(privelege100Record).saveRecord();

	await req.groupRepository.findById(userRecord.groupOwnage.id, [EGROUP_RELATIONS.GROUP_PATH]);
	const groupRecord = req.groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	//part with size updating
	await req.groupPathRepository.findById(groupRecord.groupPath.id);
	const groupPathRecord = req.groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const updatedSizeMax = await calculateCurrentMaxStorageSize(
		req.userRepository,
		req.userPrivelegeRepository,
	);
	await req.groupPathRepository.updateSizeMax(updatedSizeMax).setTracked(false).saveRecord();

	return new SuccessMsgResponse("Success").send(res);
};
