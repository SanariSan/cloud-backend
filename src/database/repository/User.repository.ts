import { Connection, Repository } from "typeorm";
import { Logger } from "../../core";
import { User } from "../model";

class UserRepository {
    public static getRepository(connection: Connection): Repository<User> {
        try {
            return connection.getRepository(User);
        } catch (err) {
            Logger.warn("Could not get repository User");

            throw new Error("Error accessing repository");
        }
    }

    public static async findByIds(connection: Connection, id: Array<number>): Promise<Array<Object>> {
        const users = await UserRepository.getRepository(connection).findByIds([...id]);
        const filteredData = users.map((el: User) => ({
            email: el.email,
            password: el.password,
        }));

        return filteredData;
    }

    public static async create(user: User, accessTokenKey: string, refreshTokenKey: string): Promise<{ user: User }> {
        //; keystore: Keystore }> {
        const now = new Date();

        user.createdAt = now;
        user.updatedAt = now;

        const createdUser = new User();
        // const keystore = KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);
        return { user: createdUser }; // keystore: keystore };
    }

    // public static async updateFull(
    //     user: User,
    //     accessTokenKey: string,
    //     refreshTokenKey: string,
    // ): Promise<{ user: User; keystore: Keystore }> {
    //     user.updatedAt = new Date();
    //     await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    //         .lean()
    //         .exec();
    //     const keystore = await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    //     return { user: user, keystore: keystore };
    // }

    // public static updateInfo(user: User): Promise<any> {
    //     user.updatedAt = new Date();
    //     return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    //         .lean()
    //         .exec();
    // }
}

export { UserRepository };
