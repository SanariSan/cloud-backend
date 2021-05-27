import { DBManager, ENTITIES, IPrivelege500ManualInput, PRIVELEGE_500_RELATIONS, TPrivelege100Keys } from "../accessdb";
import { Logger } from "../../core";
import { Privelege500 } from "../models";
import { GenericRepository } from "./generic.repository";
import config from "config";

class Privelege500Repository extends GenericRepository<Privelege500, TPrivelege100Keys, PRIVELEGE_500_RELATIONS> {
    constructor(dbManager: DBManager) {
        super(ENTITIES.PRIVELEGE_100, dbManager);
    }

    public createPrivelege500(privelege500?: IPrivelege500ManualInput): this {
        const expDays = privelege500 ? privelege500.expiresIn : <number>config.get("privelege.lifetimeDays100_default");
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
