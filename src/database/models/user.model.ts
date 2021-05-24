import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.model";
import { Keystore } from "./keystore.model";

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
