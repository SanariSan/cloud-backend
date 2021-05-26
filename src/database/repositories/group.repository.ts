import { DBManager, ENTITIES, IGroupManualInput, TGroupKeys } from "../accessdb";
import { Logger } from "../../core";
import { Group, GroupPath, User } from "../models";
import { GenericRepository } from "./generic.repository";

class GroupRepository extends GenericRepository<Group, TGroupKeys> {
    constructor(dbManager: DBManager) {
        super(ENTITIES.GROUP, dbManager);
    }

    public addPathOwnage(groupPath: GroupPath): this {
        try {
            if (this.repository && this.record) {
                this.record.groupPathId = this.lastOperationResult = groupPath;

                Logger.debug(`${this.addPathOwnage.name}`);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.addPathOwnage.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //add user to group
    public addUser(user: User): this {
        try {
            if (this.record) {
                this.lastOperationResult = this.record.userParticipate.push(user);

                Logger.debug(`${this.addUser.name}`);
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

                Logger.debug(`${this.removeUser.name}`);
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
        Logger.debug(`${this.createGroup.name}`);

        return this;
    }
}

export { GroupRepository };
