import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Keystore extends BaseEntity {
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

export interface IKeystore {
    id: number;
    accessTokenKey: string;
    refreshTokenKey: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}

export type TKeysKeystore = "id" | "accessTokenKey" | "refreshTokenKey" | "createdAt" | "updatedAt" | "user";
