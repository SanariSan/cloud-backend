import { Connection, ConnectionOptions } from "typeorm";
import { DBManager, Keystore, KeystoreRepository, User, Group, UserRepository } from "./database";
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

async function test(connection: Connection): Promise<void> {
    try {
        const now = new Date();

        const groupRepos1 = await connection.getRepository(Group);

        const accessTokenKey = "test_token";
        const refreshTokenKey = "test_refresh_token";
        const { user: createdUser, keystore } = await UserRepository.create(
            connection,
            <User>{
                name: "test2",
                email: "test2",
                profilePicUrl: "test_url",
                password: "test_hash",
            },
            accessTokenKey,
            refreshTokenKey,
        );

        await KeystoreRepository.save(connection, keystore);
        await UserRepository.save(connection, createdUser);

        //createGroup

        // const Group1: Group = new Group(); //get this one
        // Group1.name = "gname1";
        // Group1.password = "gpass1";
        // Group1.createdAt = now;
        // Group1.updatedAt = now;
        // await groupRepos1.save(Group1);
        // const Group1: Group = <Group>await groupRepos1.findOne(1); //find group by id

        //addGroupOwnage
        //send Group1 to method where
        // const foundUser: User = <User>await UserRepository.findById(connection, createdUser.id);
        // foundUser.groupOwn = Group1;
        // await UserRepository.save(connection, foundUser);

        //addUserToGroup in GroupRepos
        const foundGroup1: Group = <Group>await groupRepos1.findOne(1, { relations: ["user"] }); //find group by id
        foundGroup1.user.push(createdUser); //add user instance
        await groupRepos1.save(foundGroup1); //save

        // console.log(await UserRepository.findById(connection, createdUser.id));
        // console.log(await KeystoreRepository.findByToken(connection, accessTokenKey));

        // await KeystoreRepository.remove(connection, keystore.id);
        // await UserRepository.remove(connection, createdUser.id);

        // console.log(await UserRepository.findById(connection, createdUser.id));
        // console.log(await KeystoreRepository.findByToken(connection, accessTokenKey));
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE TEST USER", err);
        process.exit(1);
    }
}

async function initializeDb(): Promise<Connection> {
    try {
        const options: ConnectionOptions = config.get("db.auth");
        const dbManager: DBManager = new DBManager(options, [User, Keystore, Group]);
        const connection = (await dbManager.createConnection()).getConnection();

        await connection.synchronize();

        return connection;
    } catch (err) {
        Logger.warn("PROBLEMS WITH DATABASE SYNC", err);
        process.exit(1);
    }
}

export { initializeDb, testUser, test };
