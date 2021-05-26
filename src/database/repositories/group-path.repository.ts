import { DBManager, ENTITIES, IGroupPathManualInput, TGroupPathKeys } from "../accessdb";
import { Logger } from "../../core";
import { GroupPath } from "../models";
import { GenericRepository } from "./generic.repository";

class GroupPathRepository extends GenericRepository<GroupPath, TGroupPathKeys> {
    constructor(dbManager: DBManager) {
        super(ENTITIES.GROUP_PATH, dbManager);
    }

    public updateSizeUsed(size: number): this {
        try {
            if (this.record) {
                this.lastOperationResult = this.record.sizeUsed = size;

                Logger.debug(`${this.updateSizeUsed.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.updateSizeUsed.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public updateSizeMax(size: number): this {
        try {
            if (this.record) {
                this.lastOperationResult = this.record.sizeMax = size;

                Logger.debug(`${this.updateSizeMax.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.updateSizeMax.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public createGroupPath(groupPath: IGroupPathManualInput): this {
        const now = new Date();
        this.record = new GroupPath();

        this.record.pathName = groupPath.pathName;
        this.record.sizeMax = groupPath.sizeMax;
        this.record.sizeUsed = groupPath.sizeUsed;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;
        Logger.debug(`${this.createGroupPath.name}_${JSON.stringify(this.lastOperationResult)}`);

        return this;
    }
}

export { GroupPathRepository };
