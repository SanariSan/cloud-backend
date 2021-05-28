import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Privelege100 } from "./privelege-100.model";
import { Privelege500 } from "./privelege-500.model";

@Entity()
export class UserPrivelege {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@OneToMany((type) => Privelege100, (privelege100) => privelege100.userPrivilege)
	privelege100!: Array<Privelege100>;

	@OneToMany((type) => Privelege500, (privelege500) => privelege500.userPrivilege)
	privelege500!: Array<Privelege500>;
}
