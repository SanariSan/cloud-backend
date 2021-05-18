import { Connection, ConnectionOptions } from "typeorm";
import { DBManager, Keystore, KeystoreRepository, User, UserRepository } from "./database";
import { Logger } from "./core";
import config from "config";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function testUser(connection: Connection): Promise<void> {
    try {
        const accessTokenKey = "test_token";
        const refreshTokenKey = "test_refresh_token";
        const { user: createdUser, keystore } = await UserRepository.create(
            connection,
            <User>{
                name: "test",
                email: "test",
                profilePicUrl: "test_url",
                password: "test_hash",
            },
            accessTokenKey,
            refreshTokenKey,
        );

        await KeystoreRepository.save(connection, keystore);
        await UserRepository.save(connection, createdUser);

        console.log(await UserRepository.findById(connection, createdUser.id));
        console.log(await KeystoreRepository.findByToken(connection, accessTokenKey));

        await KeystoreRepository.remove(connection, keystore.id);
        await UserRepository.remove(connection, createdUser.id);

        console.log(await UserRepository.findById(connection, createdUser.id));
        console.log(await KeystoreRepository.findByToken(connection, accessTokenKey));
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE TEST USER", err);
        process.exit(1);
    }
}

async function initializeDb(): Promise<Connection> {
    try {
        const options: ConnectionOptions = config.get("db.auth");
        const dbManager: DBManager = new DBManager(options, [User, Keystore]);
        const connection = (await dbManager.createConnection()).getConnection();

        await connection.synchronize();

        return connection;
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE SYNC", err);
        process.exit(1);
    }
}

export { initializeDb, testUser };
