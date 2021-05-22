import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { getFuncName } from "../../helpers";
import { IKeystore, Keystore, TKeystore } from "../models";

class KeystoreRepository {
    private record: Keystore | null;
    private repository: Repository<Keystore> | null;
    private lastOperationResult: any | null;

    constructor() {
        this.record = null;
        this.repository = null;
        this.lastOperationResult = null;
    }

    public initializeRepository(connection: Connection): KeystoreRepository {
        try {
            this.repository = connection.getRepository(Keystore);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async removeRecord(): Promise<KeystoreRepository> {
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

    public async findByToken(accessTokenKey: string): Promise<KeystoreRepository> {
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

    public async findByBothTokens(accessTokenKey: string, refreshTokenKey: string): Promise<KeystoreRepository> {
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

    public createKeystore(accessTokenKey: string, refreshTokenKey: string): KeystoreRepository {
        const now = new Date();
        this.record = new Keystore();

        this.record.accessTokenKey = accessTokenKey;
        this.record.refreshTokenKey = refreshTokenKey;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;

        return this;
    }

    public async saveRecord(): Promise<KeystoreRepository> {
        try {
            if (this.repository && this.record) {
                this.record.updatedAt = new Date();
                this.lastOperationResult = await this.repository.save(this.record);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.saveRecord)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public getRepository(): Repository<Keystore> | null {
        return this.repository;
    }

    public getRecord(keys: Array<TKeystore>): Keystore | null {
        if (keys && keys.length) {
            const keystore: IKeystore = <IKeystore>{};
            keys.forEach((key: TKeystore) => {
                //@ts-ignore
                if (this.record) keystore[key] = this.record[key];
            });

            return keystore;
        }

        return this.record;
    }

    //probably won't be used in prod
    public getLastOperationResult(): any | null {
        return this.lastOperationResult;
    }
}

export { KeystoreRepository };
