import { Logger } from "../../core";
import { DBManager, ENTITIES, EUSER_KEYS, EUSER_RELATIONS, IUserManualInput } from "../connection";
import { Group, Keystore, User, UserPrivelege } from "../models";
import { IGroup } from "../types/igroup.type";
import { GenericRepository } from "./generic.repository";

class UserRepository extends GenericRepository<User, EUSER_KEYS, EUSER_RELATIONS> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.USER, dbManager);
	}

	public async findByEmail(email: string, relations?: Array<EUSER_RELATIONS>): Promise<this> {
		try {
			if (this.repository) {
				this.record = this.lastOperationResult = <User | null>this.convertToNull(
					<User>await this.repository.findOne({
						where: {
							email,
						},
						relations,
					}),
				);

				Logger.debug(`${this.findByEmail.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.findByEmail.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public addKeystore(keystore: Keystore): this {
		try {
			if (this.repository && this.record) {
				this.lastOperationResult = this.record.keystore.push(keystore);

				Logger.debug(`${this.addKeystore.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addKeystore.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public addGroupOwnage(group: Group): this {
		try {
			if (this.repository && this.record) {
				this.record.groupOwnage = this.lastOperationResult = group;

				Logger.debug(`${this.addGroupOwnage.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addGroupOwnage.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public addGroupParticipance(group: Group): this {
		try {
			if (this.repository && this.record) {
				this.lastOperationResult = this.record.groupsParticipate.push(group);

				Logger.debug(`${this.addGroupParticipance.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addGroupParticipance.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public removeGroupParticipance(group: Group): this {
		try {
			if (this.repository && this.record) {
				this.record.groupsParticipate = this.lastOperationResult =
					this.record.groupsParticipate.filter(
						(existingGroup: IGroup) => existingGroup.id !== group.id,
					);

				Logger.debug(`${this.removeGroupParticipance.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.removeGroupParticipance.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public addUserPrivelege(userPrivelege: UserPrivelege): this {
		try {
			if (this.repository && this.record) {
				this.record.userPrivelege = this.lastOperationResult = userPrivelege;

				Logger.debug(`${this.addUserPrivelege.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addUserPrivelege.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public setPassword(newPassword: string): this {
		try {
			if (this.record) {
				this.record.password = this.lastOperationResult = newPassword;

				Logger.debug(`${this.setPassword.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.setPassword.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	//IF WANT TO removeRecord
	//check somehow if all keystores for this user deleted
	//check somehow if all relations to groups deleted

	public createUser(user: IUserManualInput): this {
		const now = new Date();
		this.record = new User();

		this.record.name = user.name;
		this.record.email = user.email;
		this.record.password = user.password;
		this.record.profilePicUrl = user.profilePicUrl || null;
		this.record.keystore = [];
		this.record.groupsParticipate = [];
		this.record.createdAt = now;
		this.record.updatedAt = now;

		this.lastOperationResult = this.record;
		Logger.debug(`${this.createUser.name}`);

		return this;
	}
}

export { UserRepository };
