import { ENTITIES, IGroupManual } from "../types-database.type";
import { Logger } from "../../core";
import { Group, User } from "../models";
import { GenericRepository } from "./generic.repository";

class GroupRepository extends GenericRepository<Group> {
    constructor() {
        super(ENTITIES.GROUP);
    }

    //add user to group
    public addUser(user: User): this {
        try {
            if (this.record) {
                this.record.userParticipate.push(user);
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
                this.record.userParticipate = this.record.userParticipate.filter(
                    (existingUser: User) => existingUser.id !== user.id,
                );
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${this.removeUser.name}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public createGroup(group: IGroupManual): this {
        const now = new Date();
        this.record = new Group();

        this.record.name = group.name;
        this.record.password = group.password;
        this.record.userParticipate = [];
        this.record.createdAt = now;
        this.record.updatedAt = now;

        return this;
    }
}

export { GroupRepository };
