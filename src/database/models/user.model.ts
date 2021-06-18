import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { IGroup } from "../types/igroup.type";
import { IKeystore } from "../types/ikeystore.type";
import { IUser } from "../types/iuser.type";
import { IUserPrivelege } from "../types/iuserPrivelege.type";

@Entity()
export class User implements IUser {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	name!: string | null;

	@Column("text")
	email!: string;

	@Column("text")
	password!: string;

	@Column({ type: "text", nullable: true })
	profilePicUrl!: string | null;

	//ownage of only 1 group
	@OneToOne("Group")
	@JoinColumn({ name: "groupOwnageId" })
	groupOwnage!: IGroup;

	//but can join multiple groups
	//with this column we can check all the groups this user in
	@ManyToMany("Group", "usersParticipate")
	@JoinColumn({ name: "groupParticipateId" })
	groupsParticipate!: Array<IGroup>;

	//ownage of only 1 priveleges list
	@OneToOne("UserPrivelege")
	@JoinColumn({ name: "userPrivelegeId" })
	userPrivelege!: IUserPrivelege;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@OneToMany("Keystore", "user")
	keystore!: Array<IKeystore>;
}
