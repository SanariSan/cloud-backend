import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupUser } from "./group-user.model";
import { Group } from "./group.model";
import { Keystore } from "./keystore.model";
import { UserPrivelege } from "./user-privelege.model";

@Entity()
export class User {
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

    //ownage of only 1 group
    @OneToOne(type => UserPrivelege)
    @JoinColumn({ name: "userPrivelegeId" })
    userPrivelege!: UserPrivelege;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    updatedAt!: Date;

    @OneToMany(type => Keystore, keystore => keystore.user)
    keystore!: Array<Keystore>;

    //but can join multiple groups
    //with this column we can check all the groups this user in

    @OneToMany(type => GroupUser, groupUser => groupUser.groupParticipate) //"userParticipate")
    @JoinColumn({ name: "groupParticipateId" })
    groupParticipate!: Array<GroupUser>;
}
