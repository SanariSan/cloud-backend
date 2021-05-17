import { Logger } from "../core";
import config from "config";
import { Entity, createConnection, Connection, ConnectionOptions, EntityTarget } from "typeorm";

const connectionLifespanMins: number = config.get("db.");

export class DBConnection {
    private connection?: Connection;
    private connectionOptions?: ConnectionOptions;
    private entities?: Array<EntityTarget<typeof Entity>>;
    private connectionLifespanMs: number = connectionLifespanMins * 60 * 1000;
    private connectionAutoCloseTimeout?: NodeJS.Timeout;
    private defaultOptions = {
        autoSchemaSync: true, //DEV
    };

    constructor(connectionOptions: ConnectionOptions, entities: Array<EntityTarget<typeof Entity>>) {
        this.connectionOptions = connectionOptions;
        this.entities = entities;
    }

    public async createConnection(): Promise<DBConnection> {
        this.connection = await createConnection({
            type: "postgres",
            ...this.connectionOptions,
            ...this.defaultOptions,
            ...this.entities,
        });
        Logger.warn("Connection opened");

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
        Logger.warn(`Connection will be autoclosed in ${connectionLifespanMins} minutes`);
    }

    private async closeConnection() {
        if (this.connection) await this.connection.close();
        Logger.warn("Connection closed");
    }
}
