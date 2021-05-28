import {
	DBManager,
	ENTITIES,
	IPrivelege100ManualInput,
	PRIVELEGE_100_RELATIONS,
	TPrivelege100Keys,
} from "../connection";
import { Logger } from "../../core";
import { Privelege100 } from "../models";
import { GenericRepository } from "./generic.repository";
import config from "config";

class Privelege100Repository extends GenericRepository<
	Privelege100,
	TPrivelege100Keys,
	PRIVELEGE_100_RELATIONS
> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.PRIVELEGE_100, dbManager);
	}

	public createPrivelege100(privelege100?: IPrivelege100ManualInput): this {
		const expDays = privelege100
			? privelege100.expiresIn
			: <number>config.get("privelege.lifetimeDays100_default");
		const expMs = expDays * 24 * 60 * 60 * 1000;

		const now = new Date();
		this.record = new Privelege100();

		this.record.createdAt = now;
		this.record.updatedAt = now;
		this.record.expiresAt = new Date(now.getTime() + expMs);

		this.lastOperationResult = this.record;
		Logger.debug(`${this.createPrivelege100.name}`);

		return this;
	}
}

export { Privelege100Repository };
