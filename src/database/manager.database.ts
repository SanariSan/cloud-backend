import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { Logger } from "../core";
import { Entities } from "./models";
import config from "config";

export class DBManager {
    private connection?: Connection;
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

    constructor(additionalOptions?: ConnectionOptions) {
        this.additionalOptions = additionalOptions;
        this.connectionName = (Math.random() * 100).toString();
    }

    static async getNewConnection(additionalOptions?: ConnectionOptions) {
        return await new DBManager(additionalOptions).createConnection().then(_ => _.getConnection());
    }

    public async createConnection(): Promise<this> {
        const options: ConnectionOptions = <ConnectionOptions>{
            type: "postgres",
            name: this.connectionName,
            ...this.authOptions,
            ...this.defaultOptions,
            ...this.additionalOptions,
            entities: <any>[...Entities],
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
        Logger.warn(`Connection ${this.connectionName} will be autoclosed in ${this.connectionLifespanSecs} seconds`);
    }

    private async closeConnection() {
        if (this.connection) await this.connection.close();
        Logger.warn(`Connection ${this.connectionName} closed`);
    }
}
