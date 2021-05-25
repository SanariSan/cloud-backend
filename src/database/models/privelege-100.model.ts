import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserPrivelege } from "./user-privelege.model";

@Entity()
export class Privelege100 {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    expiresAt!: Date;

    @ManyToMany(type => UserPrivelege, userPrivilege => userPrivilege.privelege100)
    @JoinColumn({ name: "userId" })
    userPrivilege!: Array<UserPrivelege>;
}