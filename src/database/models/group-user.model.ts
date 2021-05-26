import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Group } from "./group.model";
import { User } from "./user.model";

@Entity()
export class GroupUser {
    // @PrimaryGeneratedColumn()
    // id!: number;

    @ManyToOne(type => User, user => user.groupParticipate, { primary: true })
    @JoinColumn({ name: "userParticipateId" })
    userParticipate!: User;

    @ManyToOne(type => Group, group => group.userParticipate, { primary: true })
    @JoinColumn({ name: "groupParticipateId" })
    groupParticipate!: Group;
}
