import { Connection } from "typeorm";
import { Logger } from "./core";
import { DBManager, ENTITIES } from "./database/connection";

async function initializeDb(): Promise<any> {
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

		// because of foreign keys it's not always possible to drop it with 1 attempt
		if (process.env.DROP_ON_RESTART === "true") {
			for (let i = 0; i < 5; i++) {
				await connection.dropDatabase().catch((e) => Logger.warn("DROP ERR", e));
			}
		}

		await connection.synchronize();
	} catch (err) {
		Logger.warn("PROBLEMS WITH DATABASE INITIALIZATION", err);
		throw err;
	}
}

export { initializeDb };
