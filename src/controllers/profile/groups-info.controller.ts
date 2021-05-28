// import { Response, NextFunction } from "express";
// import { ProtectedRequest } from "../../../../types";
// import { NoEntryError, SuccessResponse } from "../../../../core";

// // req.body.send === [{ownerId: id, groupId: id}, ...]
// // req.body === id: groupId
// export const GroupGetInfo = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
//     let result: Array<{ ownerId: number; groupId: number }> = [];

//     await req.userRepository.findByEmail(req.body.ownerEmail, ["groupOwnage"]);
//     const userRecord = req.userRepository.getRecord();
//     if (!userRecord) throw new NoEntryError("No Users Found");

//     if (userRecord.groupOwnage)
//         result = [
//             {
//                 ownerId: userRecord.id,
//                 groupId: userRecord.groupOwnage.id,
//             },
//         ];

//     return new SuccessResponse("Groups found", result).send(res);
// };
