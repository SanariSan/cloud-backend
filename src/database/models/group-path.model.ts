import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./group.model";

@Entity()
export class GroupPath {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("text")
    pathName!: string;

    @Column("int8")
    sizeMax!: number;

    @Column("int8")
    sizeUsed!: number;

    @Column("text")
    createdAt!: Date;

    @Column("text")
    updatedAt!: Date;
}
