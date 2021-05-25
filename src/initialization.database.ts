import { Connection } from "typeorm";
import { Logger } from "./core";
import { DBManager, ENTITIES } from "./database";

async function initializeDb(): Promise<Connection> {
    try {
        const connection: Connection = await new DBManager([ENTITIES.USER, ENTITIES.KEYSTORE, ENTITIES.GROUP])
            .createConnection()
            .then(_ => _.connection);
        await connection.synchronize();

        return connection;
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE SYNC", err);
        throw new Error(err);
    }
}

export { initializeDb };
