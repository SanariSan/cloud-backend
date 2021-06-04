import {
	DBManager,
	ENTITIES,
	IGroupManualInput,
	EGROUP_KEYS,
	EGROUP_RELATIONS,
} from "../connection";
import { Logger } from "../../core";
import { Group, GroupPath, User } from "../models";
import { GenericRepository } from "./generic.repository";
import { IUser } from "../types/iuser.type";

class GroupRepository extends GenericRepository<Group, EGROUP_KEYS, EGROUP_RELATIONS> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.GROUP, dbManager);
	}

	public addPathOwnage(groupPath: GroupPath): this {
		try {
			if (this.repository && this.record) {
				this.record.groupPath = this.lastOperationResult = groupPath;

				Logger.debug(`${this.addPathOwnage.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addPathOwnage.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	//add user to group
	public addParticipant(user: User): this {
		try {
			if (this.record) {
				this.lastOperationResult = this.record.usersParticipate.push(user);

				Logger.debug(`${this.addParticipant.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addParticipant.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	//remove user from group
	public removeParticipant(user: User): this {
		try {
			if (this.record) {
				this.record.usersParticipate = this.lastOperationResult =
					this.record.usersParticipate.filter(
						(existingUser: IUser) => existingUser.id !== user.id,
					);

				Logger.debug(`${this.removeParticipant.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.removeParticipant.name}, ${err}`;
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

	public async findByName(name: string, relations?: Array<EGROUP_RELATIONS>): Promise<this> {
		try {
			if (this.repository) {
				this.records = this.lastOperationResult = <Array<Group | null>>this.convertToNull(
					<Array<Group>>await this.repository.find({
						where: {
							name,
						},
						relations,
					}),
				);
			}

			Logger.debug(`${this.findByIds.name}`);
			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.findByIds.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public createGroup(group: IGroupManualInput): this {
		const now = new Date();
		this.record = new Group();

		this.record.name = group.name;
		this.record.password = group.password;
		this.record.usersParticipate = [];
		this.record.createdAt = now;
		this.record.updatedAt = now;

		this.lastOperationResult = this.record;
		Logger.debug(`${this.createGroup.name}`);

		return this;
	}
}

export { GroupRepository };
