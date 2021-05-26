import { Response, NextFunction } from "express";
import { ProtectedRequest } from "../../../../types";
import { AuthFailureError, BadRequestError, SuccessResponse } from "../../../../core";
import bcrypt from "bcrypt";

// req.body === {joinerId: id, ownerId: id, groupId: id}
export const GroupJoin = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    //search for target group
    await req.groupRepository.findById(req.body.groupId);

    //if found - get record
    const groupRecord = req.groupRepository.getRecord();
    if (!groupRecord) throw new Error();

    //check pass
    const matchPass: boolean = await bcrypt.compare(req.body.password, groupRecord.password);
    if (!matchPass) throw new AuthFailureError("Authentication failure");

    //check if user already in group
    const participants = groupRecord.usersParticipate;
    if (participants.some(user => user.id === req.body.joinerId))
        throw new BadRequestError("You are already in this group");

    //search for user
    await req.userRepository.findById(req.body.joinerId);

    //if found - get record
    const userRecord = req.userRepository.getRecord();
    if (!userRecord) throw new Error();

    //add target group's record to user's groups list
    await req.userRepository.addGroupParticipance(groupRecord).saveRecord();

    //get updated user's record
    // userRecord = req.userRepository.getRecord();
    // if (!userRecord) throw new Error();

    //add user's record to target group's users list
    await req.groupRepository.addUser(userRecord).saveRecord();

    return new SuccessResponse("Group created", {
        group: req.groupRepository.getRecord(["id", "name"]),
        size: req.groupPathRepository.getRecord(["id", "sizeUsed", "sizeMax"]),
    }).send(res);
};
