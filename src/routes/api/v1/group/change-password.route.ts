import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../../types";
import { AuthFailureError, BadRequestError, SuccessMsgResponse } from "../../../../core";
import bcrypt from "bcrypt";

// req.body === {oldPassword: string, newPassword: string, }
export const GroupChangePassword = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const userRecord = req.userRepository.getRecord();
    if (!userRecord) throw new Error();

    if (!userRecord.groupOwnage) throw new BadRequestError("You don't own any groups.");

    const matchPass = await bcrypt.compare(req.body.oldPassword, userRecord.groupOwnage.password);
    if (!matchPass) throw new AuthFailureError("Wrong password");

    await req.groupRepository.findById(userRecord.groupOwnage.id);
    const groupRecord = req.groupRepository.getRecord();
    if (!groupRecord) throw new Error();

    const newPassword = await bcrypt.hash(req.body.newPassword, 12);
    await req.groupRepository.setPassword(newPassword).saveRecord();

    return new SuccessMsgResponse("Password changed").send(res);
};
