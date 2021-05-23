import { Connection, ConnectionOptions } from "typeorm";
import { DBManager, Keystore, KeystoreRepository, Music, MusicRepository, User, UserRepository } from "./database";
import { Logger } from "./core";
import fs from "fs";
import path from "path";
import config from "config";

function readMusicFiles() {
    // console.log(fs.readdirSync("./"));
    const fileNamesArr = fs.readdirSync(path.join(__dirname, "../music-src"));

    return fileNamesArr;
}

async function initializeMusic(): Promise<Connection> {
    try {
        const options: ConnectionOptions = config.get("db.auth");
        const dbManager: DBManager = new DBManager(options, [Music]);
        const connection = (await dbManager.createConnection()).getConnection();

        const fileNamesArr = readMusicFiles();
        for (let fileName of fileNamesArr) {
            const song: Music = await MusicRepository.create(connection, <Music>{
                songName: fileName.slice(0, fileName.indexOf(".")),
                fileName,
            });

            await MusicRepository.save(connection, song);
        }

        await connection.synchronize();

        return connection;
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE SYNC", err);
        throw new Error(err);
        // process.exit(1);
    }
}

export { initializeMusic };
