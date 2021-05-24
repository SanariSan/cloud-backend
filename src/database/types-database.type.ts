import { User, Group, Keystore } from "../database";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    profilePicUrl: string;
    groupOwnage: Group;
    createdAt: Date;
    updatedAt: Date;
    keystore: Array<Keystore>;
    groupParticipate: Array<Group>;
}

export interface IUserManual {
    name: string;
    email: string;
    password: string;
    profilePicUrl: string;
}

export type TKeysUser =
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

export interface IKeystore {
    id: number;
    accessTokenKey: string;
    refreshTokenKey: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
export interface IKeystoreManual {
    accessTokenKey: string;
    refreshTokenKey: string;
}
export type TKeysKeystore = "id" | "accessTokenKey" | "refreshTokenKey" | "createdAt" | "updatedAt" | "user";

//-----------------------------------------

export interface IGroup {
    id: number;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    userParticipate: Array<User>;
}
export interface IGroupManual {
    name: string;
    password: string;
}
export type TKeysGroup = "id" | "name" | "password" | "createdAt" | "updatedAt" | "userParticipate";

//-----------------------------------------

export enum ENTITIES {
    USER = "User",
    KEYSTORE = "Keystore",
    GROUP = "Group",
}
export type TEntities = ENTITIES.USER | ENTITIES.KEYSTORE | ENTITIES.GROUP;
export type TModel = User | Keystore | Group;
export type TIModel = IUser | IKeystore | IGroup;
export type TKeysModel = TKeysUser | TKeysKeystore | TKeysGroup;
