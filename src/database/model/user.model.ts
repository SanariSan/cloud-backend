import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Keystore } from "./keystore.model";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    name?: string;

    @Column("text")
    email?: string;

    @Column("text")
    password?: string;

    @Column({ type: "text", nullable: true })
    profilePicUrl?: string;

    @Column("text")
    createdAt?: Date;

    @Column("text")
    updatedAt?: Date;

    @OneToMany(type => Keystore, keystore => keystore.user)
    keystore?: Keystore[];
}
