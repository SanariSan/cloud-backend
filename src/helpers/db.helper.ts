import { ConnectionOptions } from "typeorm";
import { TEntities } from "../database/types-database.type";
import { DBManager } from "../database/manager.database";
import config from "config";

async function getNewConnection(entities: Array<TEntities>) {
    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, entities);
    const connection = await dbManager.createConnection().then(_ => _.getConnection());

    return connection;
}

export { getNewConnection };
