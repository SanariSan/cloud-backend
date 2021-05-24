import { ConnectionOptions, EntityTarget } from "typeorm";
import { TModel, TEntities } from "../database/types-database.type";
import { DBManager } from "../database/manager.database";
import config from "config";

async function getNewConnection(entities: Array<TEntities>) {
    console.log(1);
    const options: ConnectionOptions = config.get("db.auth");
    console.log(2);
    const dbManager: DBManager = new DBManager(options, [...entities]);
    console.log(3);
    const connection = (await dbManager.createConnection()).getConnection();
    console.log(4);

    return connection;
}

export { getNewConnection };
