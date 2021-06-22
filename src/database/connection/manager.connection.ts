import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { PostgresConnectionCredentialsOptions } from "typeorm/driver/postgres/PostgresConnectionCredentialsOptions";
import { Logger } from "../../core";
import * as Entities from "../models";
import { TEntities } from "./";

export class DBManager {
	private openedConnection?: Connection;
	private entities: Array<TEntities>;
	private additionalOptions?: Partial<ConnectionOptions>;
	private connectionName: string;
	private connectionLifespanSecs: number = parseInt(<string>process.env.CONNECTION_LIFESPAN_SECS);
	private connectionLifespanMs: number = this.connectionLifespanSecs * 1000;
	private connectionAutoCloseTimeout?: NodeJS.Timeout;
	private authOptions?: PostgresConnectionCredentialsOptions = {
		host: <string>process.env.DB_HOST,
		port: parseInt(<string>process.env.DB_PORT),
		username: <string>process.env.DB_USERNAME,
		password: <string>process.env.DB_PASSWORD,
		database: <string>process.env.DB_DATABASE,
	};
	private defaultOptions = {
		ssl: {
			rejectUnauthorized: false,
		},
		extra: {
			connectionLimit: 100,
		},
	};

	constructor(entities: Array<TEntities>, additionalOptions?: ConnectionOptions) {
		this.entities = entities;
		this.additionalOptions = additionalOptions;
		this.connectionName = (Math.random() * 100).toString();
	}

	public async createConnection(): Promise<this> {
		const filteredEntities = Object.keys(Entities)
			.filter((key) => this.entities.includes(<TEntities>key))
			.map((key) => Entities[key]);

		const options: ConnectionOptions = <ConnectionOptions>{
			type: "postgres",
			name: this.connectionName,
			...this.authOptions,
			...this.defaultOptions,
			...this.additionalOptions,
			entities: filteredEntities,
		};

		console.log(options);

		this.openedConnection = await createConnection(options);

		// Logger.debug(`Connection options ${JSON.stringify(options)} with entities ${JSON.stringify(this.entities)}`);
		Logger.debug(
			`Connection ${this.connectionName} with entities [${filteredEntities
				.map((_) => _.name)
				.join(", ")}] opened`,
		);

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
		this.connectionAutoCloseTimeout = setTimeout(
			this.closeConnection.bind(this),
			this.connectionLifespanMs,
		);
		Logger.debug(
			`Connection ${this.connectionName} will be autoclosed in ${this.connectionLifespanSecs} seconds`,
		);
	}

	private async closeConnection() {
		if (this.openedConnection) await this.openedConnection.close();
		Logger.debug(`Connection ${this.connectionName} closed`);
	}
}
