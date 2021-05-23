import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Group extends BaseEntity {
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

export interface IGroup {
    id: number;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    userParticipate: Array<User>;
}

export type TKeysGroup = "id" | "name" | "password" | "createdAt" | "updatedAt" | "userParticipate";
