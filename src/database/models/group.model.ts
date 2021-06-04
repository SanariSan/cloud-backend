import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { IGroup } from "../types/igroup.type";
import { IUser } from "../types/iuser.type";
import { IGroupPath } from "../types/igroup-path.type";

@Entity()
export class Group implements IGroup {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	name!: string;

	@Column({ type: "text", nullable: true })
	password!: string;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@OneToOne("GroupPath")
	@JoinColumn({ name: "groupPathId" })
	groupPath!: IGroupPath;

	//list of all users Ids have access to this group
	//with this columns we can check all users related to this particualar group
	@ManyToMany("User", "groupsParticipate")
	@JoinTable({ name: "groups_users" })
	@JoinColumn({ name: "userParticipateId" })
	usersParticipate!: Array<IUser>;
}
