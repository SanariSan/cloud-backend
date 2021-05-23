import { Logger } from "../core";
import { createConnection, Connection, ConnectionOptions, EntityTarget } from "typeorm";
import { Group, Keystore, User } from "./models";
import config from "config";

const { connectionLifespanSecs }: { connectionLifespanSecs: number } = config.get("db.options");

type TModel = User | Keystore | Group;

export class DBManager {
    private connection?: Connection;
    private connectionOptions?: ConnectionOptions;
    private entities: Array<EntityTarget<TModel>>;
    private connectionName: string;
    private connectionLifespanMs: number = connectionLifespanSecs * 1000;
    private connectionAutoCloseTimeout?: NodeJS.Timeout;
    private defaultOptions = {
        synchronize: true,
        autoSchemaSync: true, //DEV
    };

    constructor(connectionOptions: ConnectionOptions, entities: Array<EntityTarget<TModel>>) {
        this.connectionOptions = connectionOptions;
        this.entities = entities;
        this.connectionName = (Math.random() * 100).toString();

        console.log(this.entities);
    }

    public async createConnection(): Promise<this> {
        const options: ConnectionOptions = {
            type: "postgres",
            name: this.connectionName,
            ...this.connectionOptions,
            ...this.defaultOptions,
            entities: <Array<string>>this.entities,
        };
        console.log(options);

        this.connection = await createConnection(options);
        Logger.warn(`Connection ${this.connectionName} opened`);

        this.setConnectionLifespanTiomeout();

        return this;
    }

    public getConnection(): Connection {
        if (this.connection) {
            this.setConnectionLifespanTiomeout();
            return this.connection;
        }

        throw new Error("No connection available");
    }

    private setConnectionLifespanTiomeout() {
        if (this.connectionAutoCloseTimeout) clearTimeout(this.connectionAutoCloseTimeout);
        this.connectionAutoCloseTimeout = setTimeout(this.closeConnection.bind(this), this.connectionLifespanMs);
        Logger.warn(`Connection ${this.connectionName} will be autoclosed in ${connectionLifespanSecs} seconds`);
    }

    private async closeConnection() {
        if (this.connection) await this.connection.close();
        Logger.warn(`Connection ${this.connectionName} closed`);
    }
}
