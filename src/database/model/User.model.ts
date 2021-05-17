import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    profilePicUrl!: string;

    @Column("timestamp")
    createdAt!: Date;

    @Column("timestamp")
    updatedAt!: Date;
}
