import { Connection } from "typeorm";
import { Logger } from "../../core";
import { getFuncName } from "../../helpers";
import { User, Group, TKeysGroup, IGroup } from "../models";
import { GenericRepository } from "../repositories";

class GroupRepository extends GenericRepository<TKeysGroup, IGroup> {
    constructor() {
        super();
    }

    public initializeRepository(connection: Connection): this {
        try {
            this.repository = this.lastOperationResult = connection.getRepository(Group);

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //add user to group
    public async addUser(user: User): Promise<this> {
        try {
            if (this.record) {
                this.record.userParticipate.push(user);
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    //remove user from group
    public async removeUser(user: User): Promise<this> {
        try {
            if (this.record) {
                this.record.userParticipate = this.record.userParticipate.filter(
                    (existingUser: User) => existingUser.id !== user.id,
                );
            }

            return this;
        } catch (err) {
            this.lastOperationResult = `Error in ${getFuncName(this.initializeRepository)}, ${err}`;
            Logger.warn(this.lastOperationResult);
            throw new Error(this.lastOperationResult);
        }
    }

    public async createGroup(group: Group): Promise<this> {
        const now = new Date();
        this.record = new Group();

        this.record.name = group.name;
        this.record.password = group.password;
        this.record.createdAt = now;
        this.record.updatedAt = now;

        return this;
    }
}

export { GroupRepository };
