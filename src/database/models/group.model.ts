import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupPath } from "./group-path.model";
import { User } from "./user.model";

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

    @OneToOne(type => GroupPath)
    @JoinColumn({ name: "groupPathId" })
    groupPathId!: GroupPath;

    //list of all users Ids have access to this group
    //with this columns we can check all users related to this particualar group

    @ManyToMany(type => User, user => user.groupsParticipate)
    @JoinTable({ name: "groups_users" })
    @JoinColumn({ name: "userParticipateId" })
    usersParticipate!: Array<User>;
}
