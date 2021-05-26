import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupPath } from "./group-path.model";
import { GroupUser } from "./group-user.model";

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

    @OneToMany(type => GroupUser, groupUser => groupUser.userParticipate) //"groupParticipate")
    @JoinColumn({ name: "userParticipateId" })
    userParticipate!: Array<GroupUser>;
}
