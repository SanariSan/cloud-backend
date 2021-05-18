import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Music {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    songName!: string;

    @Column("text")
    fileName!: string;

    // @ManyToMany(type => User, user => user.playlist)
    // @JoinColumn({ name: "playlistId" })
    // user!: User;
}
