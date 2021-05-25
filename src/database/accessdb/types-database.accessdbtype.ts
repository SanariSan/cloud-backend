import { User, Group, Keystore, GroupPath, UserPrivelege, Privelege100, Privelege500 } from "../models";

//-----------------------------------------

export interface IUserManualInput {
    name: string;
    email: string;
    password: string;
    profilePicUrl: string;
}

export type TUserKeys =
    | "id"
    | "name"
    | "email"
    | "password"
    | "profilePicUrl"
    | "groupOwnage"
    | "createdAt"
    | "updatedAt"
    | "keystore"
    | "groupParticipate";

//-----------------------------------------

export interface IKeystoreManualInput {
    accessTokenKey: string;
    refreshTokenKey: string;
}
export type TKeystoreKeys = "id" | "accessTokenKey" | "refreshTokenKey" | "createdAt" | "updatedAt" | "user";

//-----------------------------------------

export interface IGroupManualInput {
    name: string;
    password: string;
}
export type TGroupKeys = "id" | "name" | "password" | "createdAt" | "updatedAt" | "userParticipate";

//-----------------------------------------

export interface IGroupPathManualInput {
    pathName: string;
    sizeMax: number;
    sizeUsed: number;
}

export type TGroupPathKeys = "id" | "pathName" | "sizeMax" | "sizeUsed" | "createdAt" | "updatedAt" | "groupId";

//-----------------------------------------

export type TUserPrivelegeKeys = "id" | "createdAt" | "updatedAt" | "privelege100Id" | "privelege500Id" | "user";

//-----------------------------------------

export type TPrivelege100Keys = "id" | "createdAt" | "updatedAt" | "userPrivilege";

//-----------------------------------------
export type TPrivelege500Keys = "id" | "createdAt" | "updatedAt" | "userPrivilege";

//-----------------------------------------

export type TModels = User | Keystore | Group | GroupPath | UserPrivelege | Privelege100 | Privelege500;
export type TModelsKeys =
    | TUserKeys
    | TKeystoreKeys
    | TGroupKeys
    | TGroupPathKeys
    | TUserPrivelegeKeys
    | TPrivelege100Keys
    | TPrivelege500Keys;

//-----------------------------------------

// export type TIModel = IUser | IKeystore | IGroup;
// export interface IGroup {
//     id: number;
//     name: string;
//     password: string;
//     createdAt: Date;
//     updatedAt: Date;
//     userParticipate: Array<User>;
// }
// export interface IUser {
//     id: number;
//     name: string;
//     email: string;
//     password: string;
//     profilePicUrl: string;
//     groupOwnage: Group;
//     createdAt: Date;
//     updatedAt: Date;
//     keystore: Array<Keystore>;
//     groupParticipate: Array<Group>;
// }
// export interface IKeystore {
//     id: number;
//     accessTokenKey: string;
//     refreshTokenKey: string;
//     createdAt: Date;
//     updatedAt: Date;
//     user: User;
// }
