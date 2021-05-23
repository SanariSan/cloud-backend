import { Connection } from "typeorm";
import { Logger } from "../../core";
import { getFuncName } from "../../helpers";
import { Group, IUser, Keystore, TKeysUser, User } from "../models";
import { GenericRepository } from "../repositories";

class UserRepository extends GenericRepository<TKeysUser, IUser> {
    constructor() {
        super();
    }

    public initializeRepository(connection: Connection): this {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(User);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async findByEmail(email: string, relations?: Array<string>): Promise<this> {
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

    public async addKeystore(keystore: Keystore): Promise<this> {
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

    public async addGroupOwnage(group: Group): Promise<this> {
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

    //IF WANT TO removeRecord
    //check somehow if all keystores for this user deleted
    //check somehow if all relations to groups deleted

    public async createUser(user: User): Promise<this> {
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
}

export { UserRepository };
