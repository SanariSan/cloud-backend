import { Connection, DeleteResult, Repository, DeepPartial } from "typeorm";
import { Logger } from "../../core";
import { getFuncName } from "../../helpers";
import { TKeysUser, TKeysKeystore, IUser, IKeystore, IGroup, TKeysGroup } from "../models";

type TIModel = IUser | IKeystore | IGroup;
type TKeysModel = TKeysUser | TKeysKeystore | TKeysGroup;

abstract class GenericRepositoryAbstract<K extends TKeysModel, E extends TIModel> {
    protected abstract record: E | null;
    protected abstract records: Array<E> | null;
    protected abstract lastOperationResult: any;
    protected abstract repository: Repository<E> | null;

    constructor() {}

    public abstract initializeRepository(connection: Connection): this;
    public abstract findById(id: number, relations?: Array<string>): Promise<this>;
    public abstract findByIds(id: Array<number>, relations?: Array<string>): Promise<this>;
    public abstract removeRecord(): Promise<this>;
    public abstract saveRecord(): Promise<this>;
    public abstract saveRecords(): Promise<this>;
    public abstract getRepository(): Repository<E> | null;
    public abstract getRecord(keys?: Array<K>): E | null;
    public abstract getRecords(keys?: Array<K>): Array<E> | null;
    public abstract getLastOperationResult(): any | null;
}

class GenericRepository<K extends TKeysModel, E extends TIModel> extends GenericRepositoryAbstract<K, E> {
    protected record: E | null;
    protected records: Array<E> | null;
    protected lastOperationResult: any;
    protected repository: Repository<E> | null;

    constructor() {
        super();

        this.record = null;
        this.records = null;
        this.repository = null;
        this.lastOperationResult = null;
    }

    //recreate this method, DOES NOT WORK HERE, HARDCODE MODEL UNTIL SOLUTION FOUND
    //THIS IS JUST EXMPLE
    // public initializeRepository(connection: Connection, model: TModel): this {
    //     try {
    //         //@ts-ignore
    //         this.repository = this.lastOperationResult = connection.getRepository(model); //Keystore etc

    //         return this;
    //     } catch (err) {
    //         this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
    //         Logger.warn(this.lastOperationResult);
    //         throw new Error(this.lastOperationResult);
    //     }
    // }
    public initializeRepository(connection: Connection): this {
        return this;
    }

    public async findById(id: number, relations?: Array<string>): Promise<this> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <E>await this.repository.findOne({
                    where: {
                        id,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findById)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByIds(id: Array<number>, relations?: Array<string>): Promise<this> {
        try {
            if (this.repository) {
                this.records = this.lastOperationResult = <Array<E>>await this.repository.find({
                    where: {
                        id,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findById)}, ${err}`;
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
            this.lastOperationResult = `Error in ${getFuncName(this.removeRecord)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async saveRecord(): Promise<this> {
        try {
            if (this.repository && this.record) {
                this.record.updatedAt = new Date();
                //@ts-ignore
                this.lastOperationResult = await this.repository.save(this.record);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.saveRecord)}, ${err}`;
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

                //@ts-ignore
                this.lastOperationResult = <Array<DeepPartial<E>>>await this.repository.save(this.record);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.saveRecord)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public getRepository(): Repository<E> | null {
        return this.repository;
    }

    public getRecord(keys?: Array<K>): E | null {
        if (keys && keys.length) {
            const newRecord: E = <E>{};
            keys.forEach((key: K) => {
                //@ts-ignore
                if (this.record) newRecord[key] = this.record[key];
            });

            return newRecord;
        }

        return this.record;
    }

    public getRecords(keys?: Array<K>): Array<E> | null {
        if (this.records) {
            this.records.map((record: E) => {
                if (keys && keys.length) {
                    const newRecord: E = <E>{};
                    keys.forEach((key: K) => {
                        //@ts-ignore
                        if (this.record) newRecord[key] = record[key];
                    });

                    return record;
                }

                return record;
            });
        }

        return this.records;
    }

    //probably won't be used in prod
    public getLastOperationResult(): any | null {
        return this.lastOperationResult;
    }
}

export { GenericRepository };
