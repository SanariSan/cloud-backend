import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToMany,
    BaseEntity,
} from "typeorm";
import { Group } from "./group.model";
import { Keystore } from "./keystore.model";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name!: string;

    @Column("text")
    email!: string;

    @Column("text")
    password!: string;

    @Column({ type: "text", nullable: true })
    profilePicUrl!: string;

    //ownage of only 1 group
    @OneToOne(type => Group)
    @JoinColumn({ name: "groupOwnageId" })
    groupOwnage!: Group;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    updatedAt!: Date;

    @OneToMany(type => Keystore, keystore => keystore.user)
    keystore!: Array<Keystore>;

    //but can join multiple groups
    //with this column we can check all the groups this user in
    @ManyToMany(type => Group, group => group.userParticipate)
    @JoinColumn({ name: "groupParticipateId" })
    groupParticipate!: Array<Group>;

    // @OneToOne(type => UserPrivilege, userPrivilege => userPrivilege.user)
    // userPrivilege!: Array<UserPrivilege>;

    // @OneToOne(type => Keystore, log => log.user)
    // log!: Log[];
}

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

// export type TUser = Partial<Record<EUser, IUser>>;
// =
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
