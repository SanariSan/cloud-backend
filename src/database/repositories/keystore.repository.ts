import { Logger } from "../../core";
import {
	DBManager,
	EKEYSTORE_KEYS,
	EKEYSTORE_RELATIONS,
	ENTITIES,
	IKeystoreManualInput,
} from "../connection";
import { Keystore } from "../models";
import { GenericRepository } from "./generic.repository";

class KeystoreRepository extends GenericRepository<Keystore, EKEYSTORE_KEYS, EKEYSTORE_RELATIONS> {
	constructor(dbManager: DBManager) {
		super(ENTITIES.KEYSTORE, dbManager);
	}

	public async findByToken(accessTokenKey: string): Promise<this> {
		try {
			if (this.repository) {
				this.record = this.lastOperationResult = <Keystore | null>this.convertToNull(
					<Keystore>await this.repository.findOne({
						where: [{ accessTokenKey }],
					}),
				);

				Logger.debug(`${this.findByToken.name}`);
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
				this.record = this.lastOperationResult = <Keystore | null>this.convertToNull(
					<Keystore>await this.repository.findOne({
						where: [{ accessTokenKey, refreshTokenKey }],
					}),
				);

				Logger.debug(`${this.findByBothTokens.name}`);
			}

			return this;
		} catch (err) {
			this.lastOperationResult = `Error in ${this.findByBothTokens.name}, ${err}`;
			Logger.warn(this.lastOperationResult);
			throw new Error(this.lastOperationResult);
		}
	}

	public createKeystore(keystore: IKeystoreManualInput): this {
		const now = new Date();
		this.record = new Keystore();

		this.record.accessTokenKey = keystore.accessTokenKey;
		this.record.refreshTokenKey = keystore.refreshTokenKey;
		this.record.createdAt = now;
		this.record.updatedAt = now;

		this.lastOperationResult = this.record;
		Logger.debug(`${this.createKeystore.name}`);

		return this;
	}
}

export { KeystoreRepository };
