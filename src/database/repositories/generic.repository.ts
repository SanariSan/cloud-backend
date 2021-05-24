import { Connection, DeleteResult, Repository } from "typeorm";
import { TKeysModel, TEntities, TModel } from "../types-database.type";
import { Logger } from "../../core";

abstract class GenericRepositoryAbstract<M extends TModel> {
    protected entityName: TEntities;
    protected record: M | null;
    protected records: Array<M> | null;
    protected lastOperationResult: any;
    protected repository: Repository<any> | null;

    constructor(entityName: TEntities) {
        this.entityName = entityName;

        this.record = null;
        this.records = null;
        this.repository = null;
        this.lastOperationResult = null;
    }

    public abstract initializeRepository(connection: Connection): this;
    public abstract findById(id: number, relations?: Array<string>): Promise<this>;
    public abstract findByIds(id: Array<number>, relations?: Array<string>): Promise<this>;
    public abstract removeRecord(): Promise<this>;
    public abstract saveRecord(): Promise<this>;
    public abstract saveRecords(): Promise<this>;
    public abstract getRepository(): Repository<M> | null;
    public abstract getRecord(keys?: Array<TKeysModel>): M | null;
    public abstract getRecords(keys?: Array<TKeysModel>): Array<M> | null;
    public abstract getLastOperationResult(): any | null;
}

class GenericRepository<M extends TModel> extends GenericRepositoryAbstract<M> {
    constructor(entityName: TEntities) {
        super(entityName);
    }

    public initializeRepository(connection: Connection): this {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(this.entityName);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.initializeRepository.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findById(id: number, relations?: Array<string>): Promise<this> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <M>await this.repository.findOne({
                    where: {
                        id,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.findById.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByIds(id: Array<number>, relations?: Array<string>): Promise<this> {
        try {
            if (this.repository) {
                this.records = this.lastOperationResult = <Array<M>>await this.repository.find({
                    where: {
                        id,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.findByIds.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //probably won't be used in prod
    public async removeRecord(): Promise<this> {
        try {
            if (this.repository && this.record) {
                this.lastOperationResult = <DeleteResult>await this.repository.delete(this.record.id);
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
                this.lastOperationResult = await this.repository.save(this.record);
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
                this.records = this.records.map(el => {
                    el.updatedAt = new Date();
                    return el;
                });

                this.lastOperationResult = await this.repository.save<any>(this.record);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.saveRecords.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public getRepository(): Repository<M> | null {
        return this.repository;
    }

    public getRecord(keys?: Array<TKeysModel>): M {
        if (this.record) {
            if (keys && keys.length) {
                const newRecord: M = <M>{};
                keys.forEach((key: TKeysModel) => {
                    if (this.record) newRecord[key] = this.record[key];
                });

                return newRecord;
            }
        }

        return <M>this.record;
    }

    public getRecords(keys?: Array<TKeysModel>): Array<M> | null {
        if (this.records) {
            this.records.map((record: M) => {
                if (keys && keys.length) {
                    const newRecord: M = <M>{};
                    keys.forEach((key: TKeysModel) => {
                        if (this.record) newRecord[key] = record[key];
                    });

                    return record;
                }

                return record;
            });
        }

        return <Array<M>>this.records;
    }

    //probably won't be used in prod
    public getLastOperationResult(): any | null {
        return this.lastOperationResult;
    }
}

export { GenericRepository };
