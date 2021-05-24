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

export interface IKeystore {
    id: number;
    accessTokenKey: string;
    refreshTokenKey: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
export type TKeysKeystore = "id" | "accessTokenKey" | "refreshTokenKey" | "createdAt" | "updatedAt" | "user";

export interface IGroup {
    id: number;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    userParticipate: Array<User>;
}
export type TKeysGroup = "id" | "name" | "password" | "createdAt" | "updatedAt" | "userParticipate";

export enum ENTITIES {
    User = "User",
    Keystore = "Keystore",
    Group = "Group",
}

export type TEntities = ENTITIES;
export type TModel = User | Keystore | Group;
export type TIModel = IUser | IKeystore | IGroup;
export type TKeysModel = TKeysUser | TKeysKeystore | TKeysGroup;
