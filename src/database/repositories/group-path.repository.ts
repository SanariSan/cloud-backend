import {
	DBManager,
	ENTITIES,
	EGROUP_PATH_RELATIONS,
	IGroupPathManualInput,
	EGROUP_PATH_KEYS,
} from "../connection";
import { Logger } from "../../core";
import { GroupPath } from "../models";
import { GenericRepository } from "./generic.repository";

class GroupPathRepository extends GenericRepository<
	GroupPath,
	EGROUP_PATH_KEYS,
	EGROUP_PATH_RELATIONS
> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.GROUP_PATH, dbManager);
	}

	public updateSizeUsed(size: number): this {
		try {
			if (this.record) {
				this.lastOperationResult = this.record.sizeUsed = size;

				Logger.debug(`${this.updateSizeUsed.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.updateSizeUsed.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public updateSizeMax(defaultSize: number, extraSize: number): this {
		try {
			if (this.record) {
				this.lastOperationResult = this.record.sizeMax = defaultSize + extraSize;

				Logger.debug(`${this.updateSizeMax.name}`);
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
		Logger.debug(`${this.createGroupPath.name}`);

		return this;
	}
}

export { GroupPathRepository };
