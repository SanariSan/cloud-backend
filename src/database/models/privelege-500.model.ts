import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserPrivelege } from "./user-privelege.model";

@Entity()
export class Privelege500 {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	expiresAt!: Date;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@ManyToOne((type) => UserPrivelege)
	@JoinColumn({ name: "userPrivilegeId" })
	userPrivilege!: Array<UserPrivelege>;
}
