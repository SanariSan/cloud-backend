import { Connection } from "typeorm";
import { Logger } from "../../core";
import { getFuncName } from "../../helpers";
import { IKeystore, Keystore, TKeysKeystore } from "../models";
import { GenericRepository } from "../repositories";

class KeystoreRepository extends GenericRepository<TKeysKeystore, IKeystore> {
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

export { KeystoreRepository };
