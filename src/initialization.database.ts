import { Connection } from "typeorm";
import { Logger } from "./core";
import { DBManager, ENTITIES } from "./database/connection";

async function initializeDb({ dropDb }): Promise<Connection> {
	try {
		const connection: Connection = await new DBManager([
			ENTITIES.USER,
			ENTITIES.KEYSTORE,
			ENTITIES.GROUP,
			ENTITIES.GROUP_PATH,
			ENTITIES.USER_PRIVELEGE,
			ENTITIES.PRIVELEGE_100,
			ENTITIES.PRIVELEGE_500,
		])
			.createConnection()
			.then((_) => _.connection);

		if (dropDb) {
			for (let i = 0; i < 10; i++) {
				await connection.dropDatabase().catch((e) => Logger.warn("DROP ERR", e));
			}
		}

		await connection.synchronize();

		return connection;
	} catch (err) {
		Logger.warn("PROBLEMS WITH DATABASE INITIALIZATION", err);
		throw new Error(err);
	}
}

export { initializeDb };
