import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { getFuncName } from "../../helpers";
import { Group, IUser, Keystore, TUser, User } from "../models";
import { KeystoreRepository } from "../repositories";

class UserRepository {
    private record: User | null;
    private lastOperationResult: any;
    private repository: Repository<User> | null;

    constructor() {
        this.record = null;
        this.repository = null;
        this.lastOperationResult = null;
    }

    public initializeRepository(connection: Connection): UserRepository {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(User);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findById(id: number, relations?: Array<string>): Promise<UserRepository> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <User>await this.repository.findOne({
                    where: {
                        id,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findById)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByEmail(email: string, relations?: Array<string>): Promise<UserRepository> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <User>await this.repository.findOne({
                    where: {
                        email,
                    },
                    relations,
                });
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.findByEmail)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //probably won't be used in prod
    public async removeRecord(): Promise<UserRepository> {
        try {
            if (this.repository && this.record) {
                //check somehow if all keystores for this user deleted
                //check somehow if all relations to groups deleted
                this.lastOperationResult = <DeleteResult>await this.repository.delete(this.record.id);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.removeRecord)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async addKeystore(keystore: Keystore): Promise<UserRepository> {
        try {
            if (this.repository && this.record) {
                this.lastOperationResult = await this.record.keystore.push(keystore);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.addKeystore)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async addGroupOwnage(group: Group): Promise<UserRepository> {
        try {
            if (this.repository && this.record) {
                this.record.groupOwnage = this.lastOperationResult = group;
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.addGroupOwnage)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async createUser(user: User): Promise<UserRepository> {
        const now = new Date();
        this.record = new User();

        this.record.name = user.name;
        this.record.email = user.email;
        this.record.password = user.password;
        this.record.profilePicUrl = user.profilePicUrl;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;

        return this;
    }

    public async saveRecord(): Promise<UserRepository> {
        try {
            if (this.repository && this.record) {
                this.record.updatedAt = new Date();
                this.lastOperationResult = await this.repository.save(this.record);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.saveRecord)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public getRepository(): Repository<User> | null {
        return this.repository;
    }

    public getRecord(keys: Array<TUser>): User | null {
        if (keys && keys.length) {
            const user: IUser = <IUser>{};
            keys.forEach((key: TUser) => {
                //@ts-ignore
                if (this.record) user[key] = this.record[key];
            });

            return user;
        }

        return this.record;
    }

    //probably won't be used in prod
    public getLastOperationResult(): any | null {
        return this.lastOperationResult;
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
