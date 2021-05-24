import { Logger } from "../../core";
import { Group, Keystore, User } from "../models";
import { IUserManual, ENTITIES } from "../types-database.type";
import { GenericRepository } from "./generic.repository";

class UserRepository extends GenericRepository<User> {
    constructor() {
        super(ENTITIES.USER);
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
            this.lastOperationResult = `Error in ${this.findByEmail.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public addKeystore(keystore: Keystore): this {
        try {
            if (this.repository && this.record) {
                this.lastOperationResult = this.record.keystore.push(keystore);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addKeystore.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public addGroupOwnage(group: Group): this {
        try {
            if (this.repository && this.record) {
                this.record.groupOwnage = this.lastOperationResult = group;
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addGroupOwnage.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //IF WANT TO removeRecord
    //check somehow if all keystores for this user deleted
    //check somehow if all relations to groups deleted

    public createUser(user: IUserManual): this {
        const now = new Date();
        this.record = new User();

        this.record.name = user.name;
        this.record.email = user.email;
        this.record.password = user.password;
        this.record.profilePicUrl = user.profilePicUrl;
        this.record.keystore = [];
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;

        return this;
    }
}

export { UserRepository };
