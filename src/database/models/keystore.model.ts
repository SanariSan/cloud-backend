import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IKeystore } from "../types/ikeystore.type";
import { IUser } from "../types/iuser.type";

@Entity()
export class Keystore implements IKeystore {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column("text")
	accessTokenKey!: string;

	@Column("text")
	refreshTokenKey!: string;

	@Column("text")
	createdAt!: Date;

	@Column("text")
	updatedAt!: Date;

	@ManyToOne("User", "keystore")
	@JoinColumn({ name: "userId" })
	user!: IUser;
}
