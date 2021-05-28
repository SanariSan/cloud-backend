import { DBManager, ENTITIES, TUserPrivelegeKeys, USER_PRIVELEGE_RELATIONS } from "../accessdb";
import { Logger } from "../../core";
import { Privelege100, Privelege500, UserPrivelege } from "../models";
import { GenericRepository } from "./generic.repository";

class UserPrivelegeRepository extends GenericRepository<
	UserPrivelege,
	TUserPrivelegeKeys,
	USER_PRIVELEGE_RELATIONS
> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.USER_PRIVELEGE, dbManager);
	}

	public addPrivelege100(privelege100: Privelege100): this {
		try {
			if (this.record) {
				this.lastOperationResult = this.record.privelege100.push(privelege100);

				Logger.debug(`${this.addPrivelege100.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addPrivelege100.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public addPrivelege500(privelege500: Privelege500): this {
		try {
			if (this.record) {
				this.lastOperationResult = this.record.privelege500.push(privelege500);

				Logger.debug(`${this.addPrivelege500.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.addPrivelege500.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public createUserPrivelege(): this {
		const now = new Date();
		this.record = new UserPrivelege();

		this.record.createdAt = now;
		this.record.updatedAt = now;
		this.record.privelege100 = [];
		this.record.privelege500 = [];

		this.lastOperationResult = this.record;
		Logger.debug(`${this.createUserPrivelege.name}`);

		return this;
	}
}

export { UserPrivelegeRepository };
