import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { DBManager, TEntities, TModels, TModelsKeys, TModelsRelationsKeys } from "../connection";

abstract class GenericRepositoryAbstract<
	M extends TModels,
	K extends TModelsKeys,
	R extends TModelsRelationsKeys,
> {
	protected abstract entityName: TEntities;
	protected abstract dbManager: DBManager;
	protected abstract record: M | null;
	protected abstract records: Array<M | null>;
	protected abstract lastOperationResult: any;

	protected abstract get connection(): Connection;
	protected abstract get repository(): Repository<M>;

	protected abstract convertToNull(el: M | Array<M>): M | Array<M | null> | null;
	public abstract findById(id: number, relations?: Array<R>): Promise<this>;
	public abstract findByIds(ids?: Array<number>, relations?: Array<R>): Promise<this>;
	public abstract removeRecord(id?: number): Promise<this>;
	public abstract removeRecords(ids?: Array<number>): Promise<this>;
	public abstract saveRecord(): Promise<this>;
	public abstract saveRecords(): Promise<this>;
	public abstract getRecord(keys?: Array<Extract<TModelsKeys, K>>): M | null;
	public abstract getRecords(keys?: Array<Extract<TModelsKeys, K>>): Array<M | null>;
	public abstract getLastOperationResult(): any | null;
}

class GenericRepository<
	M extends TModels,
	K extends TModelsKeys,
	R extends TModelsRelationsKeys,
> extends GenericRepositoryAbstract<M, K, R> {
	protected entityName: TEntities;
	protected dbManager: DBManager;
	protected record: M | null;
	protected records: Array<M | null>;
	protected lastOperationResult: any;

	constructor(entityName: TEntities, dbManager: DBManager) {
		super();

		this.entityName = entityName;
		this.dbManager = dbManager;

		this.record = null;
		this.records = [];
		this.lastOperationResult = null;
	}

	protected get connection() {
		return this.dbManager.connection;
	}

	protected get repository(): Repository<M> {
		try {
			return this.connection.getRepository(this.entityName);
		} catch (err) {
			this.lastOperationResult = `Error in getter repository, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	protected convertToNull(el: M | Array<M>): M | Array<M | null> | null {
		if (Array.isArray(el)) {
			return el.map((el) => (el ? el : null));
		}

		return el ? el : null;
	}

	public async findById(id: number, relations?: Array<R>): Promise<this> {
		try {
			if (this.repository) {
				this.record = this.lastOperationResult = <M | null>this.convertToNull(
					<M>await this.repository.findOne(id, {
						relations,
					}),
				);
			}

			Logger.debug(`${this.findById.name}`);
			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.findById.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public async findByIds(ids?: Array<number>, relations?: Array<R>): Promise<this> {
		try {
			if (this.repository) {
				const idsSearch = ids && ids.length !== 0 ? ids : [];
				const optionsSearch = relations ? { relations } : undefined;

				this.records = this.lastOperationResult = <Array<M | null>>(
					this.convertToNull(
						<Array<M>>await this.repository.findByIds(idsSearch, optionsSearch),
					)
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

	public async removeRecord(id?: number): Promise<this> {
		try {
			if (this.repository && this.record) {
				id = id || this.record.id;

				this.lastOperationResult = <DeleteResult>await this.repository.delete(id);
				this.record = null;

				Logger.debug(`${this.removeRecord.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.removeRecord.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public async removeRecords(ids?: Array<number>): Promise<this> {
		try {
			if (this.repository && this.records) {
				ids =
					ids && ids.length
						? ids
						: this.records.filter((el) => el).map((el) => (<M>el).id);

				if (ids.length !== 0) {
					this.lastOperationResult = <DeleteResult>await this.repository.delete(ids);
					this.records = [];

					Logger.debug(`${this.removeRecord.name}`);
				}
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.removeRecord.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public async saveRecord(): Promise<this> {
		try {
			if (this.repository && this.record) {
				this.record.updatedAt = new Date();
				this.lastOperationResult = await this.repository.save<any>(this.record);

				Logger.debug(`${this.saveRecord.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.saveRecord.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public async saveRecords(): Promise<this> {
		try {
			if (this.repository && this.records) {
				this.records = this.records.filter((el) => el);
				this.records = this.records.map((el) => {
					if (el) el.updatedAt = new Date();
					return el;
				});

				this.lastOperationResult = await this.repository.save<any>(this.records);

				Logger.debug(`${this.saveRecord.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.saveRecords.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public getRecord(keys?: Array<Extract<TModelsKeys, K>>): M | null {
		if (this.record) {
			if (keys && keys.length) {
				const newRecord: M = <M>{};
				keys.forEach((key: TModelsKeys) => {
					if (this.record) newRecord[key] = this.record[key];
				});

				return newRecord;
			}

			Logger.debug(`${this.getRecord.name}`);
		}

		return this.record;
	}

	public getRecords(keys?: Array<Extract<TModelsKeys, K>>): Array<M> {
		if (this.records) {
			this.records = this.records.filter((el) => el);
			const newRecords: Array<M> = (this.lastOperationResult = <Array<M>>this.records.map(
				(record) => {
					if (record && keys && keys.length) {
						const newRecord: M = <M>{};
						keys.forEach((key: TModelsKeys) => {
							if (this.record) newRecord[key] = record[key];
						});

						return newRecord;
					}

					return record;
				},
			));

			Logger.debug(`${this.getRecords.name}`);
			return newRecords;
		}

		return <Array<M>>this.records;
	}

	//probably won't be used in prod
	public getLastOperationResult(): any | null {
		return this.lastOperationResult;
	}
}

export { GenericRepository };
