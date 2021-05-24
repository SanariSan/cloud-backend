import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

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