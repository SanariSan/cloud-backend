import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { Keystore, User } from "../model";
import { KeystoreRepository } from "../repository";

class UserRepository {
    public static getRepository(connection: Connection): Repository<User> {
        try {
            return connection.getRepository(User);
        } catch (err) {
            Logger.warn("Could not get repository User");
            throw new Error("Error accessing repository");
        }
    }

    public static async findById(connection: Connection, id: number): Promise<Object> {
        try {
            const user: User = <User>await UserRepository.getRepository(connection).findOne(id);
            return user;
        } catch (err) {
            Logger.warn("Not performed(findById-user), problems with connection");
            throw new Error("Not performed(findById-user), problems with connection");
        }
    }

    public static async findByEmail(connection: Connection, email: string, relations?: Array<string>): Promise<User> {
        try {
            const user: User = <User>await UserRepository.getRepository(connection).findOne({
                where: {
                    email,
                },
                relations,
            });
            return user;
        } catch (err) {
            Logger.warn("Not performed(findByEmail-user), problems with connection");
            throw new Error("Not performed(findByEmail-user), problems with connection");
        }
    }

    public static async remove(connection: Connection, id: number): Promise<DeleteResult> {
        try {
            const userRepos: Repository<User> = await UserRepository.getRepository(connection);
            return await userRepos.delete(id);
        } catch (err) {
            Logger.warn("Not performed(remove-user), problems with connection");
            throw new Error("Not performed(remove-user), problems with connection");
        }
    }

    public static async create(
        connection: Connection,
        user: User,
        accessTokenKey: string,
        refreshTokenKey: string,
    ): Promise<{ user: User; keystore: Keystore }> {
        const now = new Date();
        const createdUser: User = new User();
        const keystore: Keystore = await KeystoreRepository.create(accessTokenKey, refreshTokenKey);

        createdUser.name = user.name;
        createdUser.email = user.email;
        createdUser.password = user.password;
        createdUser.profilePicUrl = user.profilePicUrl;
        createdUser.createdAt = now;
        createdUser.updatedAt = now;
        createdUser.keystore = [keystore];

        return { user: createdUser, keystore: keystore };
    }

    public static async save(connection: Connection, user: User): Promise<User> {
        user.updatedAt = new Date();
        return await UserRepository.getRepository(connection).save(user);
    }
}

export { UserRepository };

// const preparedElement = {};
// const filteredKeys: Array<string> = [];
// for (let key in user) {
//     // if (key !== "id") {
//     // && key !== "password") {
//     filteredKeys.push(key);
//     // }s
// }
// filteredKeys.forEach(key => (user ? (preparedElement[key] = user[key]) : void 0));
