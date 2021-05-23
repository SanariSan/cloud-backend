import {
    Group,
    Keystore,
    User,
    TKeysUser,
    TKeysKeystore,
    IUser,
    IKeystore,
    IGroup,
    TKeysGroup,
    DBManager,
} from "../database";
import { ConnectionOptions, EntityTarget } from "typeorm";
import config from "config";

type TIModel = IUser | IKeystore | IGroup;
type TKeysModel = TKeysUser | TKeysKeystore | TKeysGroup;

type TModel = User | Keystore | Group;

async function getNewConnection(entities: Array<EntityTarget<TModel>>) {
    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, [...entities]);
    const connection = (await dbManager.createConnection()).getConnection();

    return connection;
}

export { getNewConnection };
