import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { Logger } from "../../core";
import { TEntities } from "./";
import * as Entities from "../models";
import config from "config";

export class DBManager {
    private openedConnection?: Connection;
    private entities: Array<TEntities>;
    private additionalOptions?: ConnectionOptions;
    private connectionName: string;
    private connectionLifespanSecs: number = config.get("db.options.connectionLifespanSecs");
    private connectionLifespanMs: number = this.connectionLifespanSecs * 1000;
    private connectionAutoCloseTimeout?: NodeJS.Timeout;
    private authOptions?: ConnectionOptions = config.get("db.auth");
    private defaultOptions = {
        synchronize: true,
        autoSchemaSync: true, //DEV
    };

    constructor(entities: Array<TEntities>, additionalOptions?: ConnectionOptions) {
        this.entities = entities;
        this.additionalOptions = additionalOptions;
        this.connectionName = (Math.random() * 100).toString();
    }

    public async createConnection(): Promise<this> {
        const options: ConnectionOptions = <ConnectionOptions>{
            type: "postgres",
            name: this.connectionName,
            ...this.authOptions,
            ...this.defaultOptions,
            ...this.additionalOptions,
            entities: Object.keys(Entities)
                .filter(key => this.entities.includes(<TEntities>key))
                .map(key => Entities[key]),
        };

        this.openedConnection = await createConnection(options);

        Logger.debug(`Connection options ${JSON.stringify(options)}`);
        Logger.debug(`Connection ${this.connectionName} opened`);

        return this;
    }

    public get connection(): Connection {
        if (this.openedConnection) {
            this.updateConnectionLifespanTiomeout();
            return this.openedConnection;
        }

        throw new Error("No connection available");
    }

    private updateConnectionLifespanTiomeout() {
        if (this.connectionAutoCloseTimeout) clearTimeout(this.connectionAutoCloseTimeout);
        this.connectionAutoCloseTimeout = setTimeout(this.closeConnection.bind(this), this.connectionLifespanMs);
        Logger.debug(`Connection ${this.connectionName} will be autoclosed in ${this.connectionLifespanSecs} seconds`);
    }

    private async closeConnection() {
        if (this.openedConnection) await this.openedConnection.close();
        Logger.debug(`Connection ${this.connectionName} closed`);
    }
}