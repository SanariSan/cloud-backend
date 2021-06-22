import { Logger } from "../../core";
import {
	DBManager,
	ENTITIES,
	EPRIVELEGE_500_KEYS,
	EPRIVELEGE_500_RELATIONS,
	IPrivelege500ManualInput,
} from "../connection";
import { Privelege500 } from "../models";
import { GenericRepository } from "./generic.repository";

class Privelege500Repository extends GenericRepository<
	Privelege500,
	EPRIVELEGE_500_KEYS,
	EPRIVELEGE_500_RELATIONS
> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.PRIVELEGE_500, dbManager);
	}

	public createPrivelege500(privelege500?: IPrivelege500ManualInput): this {
		const expDays = privelege500
			? privelege500.expiresIn
			: parseInt(<string>process.env.LIFETIME_DAYS_500_DEFAULT);
		const expMs = expDays * 24 * 60 * 60 * 1000;

		const now = new Date();
		this.record = new Privelege500();

		this.record.createdAt = now;
		this.record.updatedAt = now;
		this.record.expiresAt = new Date(now.getTime() + expMs);

		this.lastOperationResult = this.record;
		Logger.debug(`${this.createPrivelege500.name}`);

		return this;
	}
}

export { Privelege500Repository };
