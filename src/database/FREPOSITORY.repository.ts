import { User, Keystore, Group } from "./models";
import {
    IUser,
    TKeysUser,
    TIModel,
    TKeysModel,
    TKeysKeystore,
    IKeystore,
    TKeysGroup,
    IGroup,
} from "./types-database.type";
import { Connection, DeleteResult, Repository, DeepPartial } from "typeorm";
import { Logger } from "../core";
import { getFuncName } from "../helpers";

abstract class GenericRepositoryAbstract<KEYS, MODEL, K extends KEYS, E extends MODEL> {
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

class GenericRepository<KEYS, MODEL, K extends KEYS, E extends MODEL> extends GenericRepositoryAbstract<
    KEYS,
    MODEL,
    K,
    E
> {
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
                //@ts-ignore
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
                //@ts-ignore
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
                    //@ts-ignore
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

class UserRepository extends GenericRepository<TKeysModel, TIModel, TKeysUser, IUser> {
    constructor() {
        super();
    }

    public initializeRepository(connection: Connection): this {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(User);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByEmail(email: string, relations?: Array<string>): Promise<this> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <User>await this.repository.findOne({
                    where: {
                        email,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findByEmail)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async addKeystore(keystore: Keystore): Promise<this> {
        try {
            if (this.repository && this.record) {
                this.lastOperationResult = await this.record.keystore.push(keystore);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.addKeystore)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async addGroupOwnage(group: Group): Promise<this> {
        try {
            if (this.repository && this.record) {
                this.record.groupOwnage = this.lastOperationResult = group;
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.addGroupOwnage)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //IF WANT TO removeRecord
    //check somehow if all keystores for this user deleted
    //check somehow if all relations to groups deleted

    public async createUser(user: User): Promise<this> {
        const now = new Date();
        this.record = new User();

        this.record.name = user.name;
        this.record.email = user.email;
        this.record.password = user.password;
        this.record.profilePicUrl = user.profilePicUrl;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;

        return this;
    }
}

class KeystoreRepository extends GenericRepository<TKeysModel, TIModel, TKeysKeystore, IKeystore> {
    constructor() {
        super();
    }

    public initializeRepository(connection: Connection): this {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(Keystore);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByToken(accessTokenKey: string): Promise<this> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <Keystore>await this.repository.findOne({
                    where: [{ accessTokenKey }],
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findByToken)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByBothTokens(accessTokenKey: string, refreshTokenKey: string): Promise<this> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <Keystore>await this.repository.findOne({
                    where: [{ accessTokenKey, refreshTokenKey }],
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findByBothTokens)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public createKeystore(accessTokenKey: string, refreshTokenKey: string): this {
        const now = new Date();
        this.record = new Keystore();

        this.record.accessTokenKey = accessTokenKey;
        this.record.refreshTokenKey = refreshTokenKey;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;

        return this;
    }
}

class GroupRepository extends GenericRepository<TKeysModel, TIModel, TKeysGroup, IGroup> {
    constructor() {
        super();
    }

    public initializeRepository(connection: Connection): this {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(Group);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //add user to group
    public async addUser(user: User): Promise<this> {
        try {
            if (this.record) {
                this.record.userParticipate.push(user);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //remove user from group
    public async removeUser(user: User): Promise<this> {
        try {
            if (this.record) {
                this.record.userParticipate = this.record.userParticipate.filter(
                    (existingUser: User) => existingUser.id !== user.id,
                );
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async createGroup(group: Group): Promise<this> {
        const now = new Date();
        this.record = new Group();

        this.record.name = group.name;
        this.record.password = group.password;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        return this;
    }
}

export { GroupRepository };
