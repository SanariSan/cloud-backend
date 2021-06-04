import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IGroupPath } from "../types/igroup-path.type";

@Entity()
export class GroupPath implements IGroupPath {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	pathName!: string;

	@Column("double")
	sizeMax!: number;

	@Column("double")
	sizeUsed!: number;

	@Column("boolean")
	tracked!: boolean;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;
}
