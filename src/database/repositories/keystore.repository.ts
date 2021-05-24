import { IKeystoreManual } from "..";
import { Logger } from "../../core";
import { Keystore } from "../models";
import { ENTITIES } from "../types-database.type";
import { GenericRepository } from "./generic.repository";

class KeystoreRepository extends GenericRepository<Keystore> {
    constructor() {
        super(ENTITIES.KEYSTORE);
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
            this.lastOperationResult = `Error in ${this.findByToken.name}, ${err}`;
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
            this.lastOperationResult = `Error in ${this.findByBothTokens.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public createKeystore(keystore: IKeystoreManual): this {
        const now = new Date();
        this.record = new Keystore();

        this.record.accessTokenKey = keystore.accessTokenKey;
        this.record.refreshTokenKey = keystore.refreshTokenKey;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;

        return this;
    }
}

export { KeystoreRepository };
