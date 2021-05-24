import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    JoinTable,
} from "typeorm";

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name!: string;

    @Column({ type: "text", nullable: true })
    password!: string;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    updatedAt!: Date;

    //list of all users Ids have access to this group
    //with this columns we can check all users related to this particualar group
    @ManyToMany(type => User, user => user.groupParticipate)
    @JoinTable({ name: "userParticipateId" })
    userParticipate!: Array<User>;
}

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

@Entity()
export class Keystore {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    accessTokenKey!: string;

    @Column("text")
    refreshTokenKey!: string;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    updatedAt!: Date;

    @ManyToOne(type => User, user => user.keystore)
    @JoinColumn({ name: "userId" })
    user!: User;
}
