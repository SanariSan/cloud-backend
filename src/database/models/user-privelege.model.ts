import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IPrivelege } from "../types/iprivelege.type";
import { IUserPrivelege } from "../types/iuserPrivelege.type";

@Entity()
export class UserPrivelege implements IUserPrivelege {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@OneToMany("Privelege100", "userPrivilege")
	privelege100!: Array<IPrivelege>;

	@OneToMany("Privelege500", "userPrivilege")
	privelege500!: Array<IPrivelege>;
}
