import { Logger } from "../../core";
import { User, Keystore, Group, UserPrivelege } from "../models";
import { IUserManualInput, ENTITIES, TUserKeys, DBManager } from "../accessdb";
import { GenericRepository } from "./generic.repository";

class UserRepository extends GenericRepository<User, TUserKeys> {
    constructor(dbManager: DBManager) {
        super(ENTITIES.USER, dbManager);
    }

    public async findByEmail(email: string, relations?: Array<string>): Promise<this> {
        try {
            if (this.repository) {
                this.record = this.lastOperationResult = <User | null>this.convertToNull(
                    <User>await this.repository.findOne({
                        where: {
                            email,
                        },
                        relations,
                    }),
                );

                Logger.debug(`${this.findByEmail.name}_${JSON.stringify(this.lastOperationResult)}`);
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

                Logger.debug(`${this.addKeystore.name}_${JSON.stringify(this.lastOperationResult)}`);
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

                Logger.debug(`${this.addGroupOwnage.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addGroupOwnage.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public addGroupParticipance(group: Group): this {
        try {
            if (this.repository && this.record) {
                this.lastOperationResult = this.record.groupParticipate.push(group);

                Logger.debug(`${this.addGroupParticipance.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addGroupParticipance.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public addUserPrivelege(userPrivelege: UserPrivelege): this {
        try {
            if (this.repository && this.record) {
                this.record.userPrivelege = this.lastOperationResult = userPrivelege;

                Logger.debug(`${this.addUserPrivelege.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addUserPrivelege.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //IF WANT TO removeRecord
    //check somehow if all keystores for this user deleted
    //check somehow if all relations to groups deleted

    public createUser(user: IUserManualInput): this {
        const now = new Date();
        this.record = new User();

        this.record.name = user.name;
        this.record.email = user.email;
        this.record.password = user.password;
        this.record.profilePicUrl = user.profilePicUrl;
        this.record.keystore = [];
        this.record.groupParticipate = [];
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;
        Logger.debug(`${this.createUser.name}_${JSON.stringify(this.lastOperationResult)}`);

        return this;
    }
}

export { UserRepository };
