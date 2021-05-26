import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
