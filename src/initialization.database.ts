import { ConnectionOptions } from "typeorm";
import { DBManager, Keystore, KeystoreRepository, User, UserRepository } from "./database";
import config from "config";
import { Logger } from "./core";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function initializeDb() {
    try {
        const options: ConnectionOptions = config.get("db.auth");
        const dbManager: DBManager = new DBManager(options, [User, Keystore]);
        const connection = (await dbManager.createConnection()).getConnection();

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

        await UserRepository.save(connection, createdUser);

        console.log(await UserRepository.findById(connection, createdUser.id));
        console.log(await KeystoreRepository.findByToken(connection, accessTokenKey));

        await KeystoreRepository.remove(connection, createdUser.id);
        await UserRepository.remove(connection, createdUser.id);

        console.log(await UserRepository.findById(connection, createdUser.id));
        console.log(await KeystoreRepository.findByToken(connection, accessTokenKey));
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE", err);
        process.exit(1);
    }
}

export { initializeDb };
