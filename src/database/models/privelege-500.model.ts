import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IPrivelege } from "../types/iprivelege.type";
import { IUserPrivelege } from "../types/iuserPrivelege.type";

@Entity()
export class Privelege500 implements IPrivelege {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	expiresAt!: Date;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@ManyToOne("UserPrivelege")
	@JoinColumn({ name: "userPrivelegeId" })
	userPrivilege!: IUserPrivelege;
}
