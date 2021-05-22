import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm";
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

    //list of all users Ids have access to this group
    //with this columns we can check all users related to this particualar group
    @ManyToMany(type => User, user => user.groupParticipate)
    @JoinTable({ name: "userParticipateId" })
    userParticipate!: Array<User>;
}
