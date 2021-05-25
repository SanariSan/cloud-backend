import { DBManager, ENTITIES, IGroupManualInput, TGroupKeys } from "../accessdb";
import { Logger } from "../../core";
import { Group, User } from "../models";
import { GenericRepository } from "./generic.repository";

class GroupRepository extends GenericRepository<Group, TGroupKeys> {
    constructor(dbManager: DBManager) {
        super(ENTITIES.GROUP, dbManager);
    }

    //add user to group
    public addUser(user: User): this {
        try {
            if (this.record) {
                this.lastOperationResult = this.record.userParticipate.push(user);

                Logger.debug(`${this.addUser.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addUser.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //remove user from group
    public removeUser(user: User): this {
        try {
            if (this.record) {
                this.record.userParticipate = this.lastOperationResult = this.record.userParticipate.filter(
                    (existingUser: User) => existingUser.id !== user.id,
                );

                Logger.debug(`${this.removeUser.name}_${JSON.stringify(this.lastOperationResult)}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.removeUser.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public createGroup(group: IGroupManualInput): this {
        const now = new Date();
        this.record = new Group();

        this.record.name = group.name;
        this.record.password = group.password;
        this.record.userParticipate = [];
        this.record.createdAt = now;
        this.record.updatedAt = now;

        this.lastOperationResult = this.record;
        Logger.debug(`${this.createGroup.name}_${JSON.stringify(this.lastOperationResult)}`);

        return this;
    }
}

export { GroupRepository };
