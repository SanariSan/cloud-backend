import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { Keystore, User } from "../model";

class KeystoreRepository {
    public static getRepository(connection: Connection): Repository<Keystore> {
        try {
            return connection.getRepository(Keystore);
        } catch (err) {
            Logger.warn("Error accessing repository -keystore", err);
            throw new Error("Error accessing repository -keystore");
        }
    }

    public static async remove(connection: Connection, id: number): Promise<DeleteResult> {
        try {
            const keystoreRepos: Repository<Keystore> = KeystoreRepository.getRepository(connection);
            // return await keystoreRepos.delete({ userId: id });
            return await keystoreRepos.delete(id);
        } catch (err) {
            Logger.warn("Not performed(delete-keystore), problems with connection", err);
            throw new Error("Not performed(delete-keystore), problems with connection");
        }
    }

    public static async findByToken(connection: Connection, accessTokenKey: string): Promise<Keystore> {
        try {
            const keystoreRepos: Repository<Keystore> = await KeystoreRepository.getRepository(connection);
            const tokenPair: Keystore = <Keystore>await keystoreRepos.findOne({
                where: [{ accessTokenKey }],
            });

            return tokenPair;
        } catch (err) {
            Logger.warn("Not performed(findOneByToken-keystore), problems with connection", err);
            throw new Error("Not performed(findOne-keystore), problems with connection");
        }
    }

    public static async findByBothTokens(
        connection: Connection,
        accessTokenKey: string,
        refreshTokenKey: string,
    ): Promise<Keystore> {
        try {
            const keystoreRepos: Repository<Keystore> = await KeystoreRepository.getRepository(connection);
            const tokenPair: Keystore = <Keystore>await keystoreRepos.findOne({
                where: [{ accessTokenKey, refreshTokenKey }],
            });

            return tokenPair;
        } catch (err) {
            Logger.warn("Not performed(findOneByBothTokens-keystore), problems with connection", err);
            throw new Error("Not performed(findOne-keystore), problems with connection");
        }
    }

    public static async create(accessTokenKey: string, refreshTokenKey: string): Promise<Keystore> {
        const now = new Date();
        const keystore: Keystore = new Keystore();

        keystore.accessTokenKey = accessTokenKey;
        keystore.refreshTokenKey = refreshTokenKey;
        keystore.createdAt = now;
        keystore.updatedAt = now;

        return keystore;
    }

    public static async save(connection: Connection, keystore: Keystore): Promise<User> {
        try {
            keystore.updatedAt = new Date();
            return await KeystoreRepository.getRepository(connection).save(keystore);
        } catch (err) {
            Logger.warn("Not performed(save-keystore), problems with connection", err);
            throw new Error("Not performed(save-keystore), problems with connection");
        }
    }
}

export { KeystoreRepository };
