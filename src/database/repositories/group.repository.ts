import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { User, Group } from "../models";
import { KeystoreRepository } from "../repositories";

class GroupRepository {
    public static getRepository(connection: Connection): Repository<Group> {
        try {
            return connection.getRepository(Group);
        } catch (err) {
            Logger.warn("Could not get repository Group");
            throw new Error("Error accessing repository");
        }
    }

    public static async findById(connection: Connection, id: number, relations?: Array<string>): Promise<Group> {
        try {
            const group: Group = <Group>await GroupRepository.getRepository(connection).findOne({
                where: {
                    id,
                },
                relations,
            });
            return group;
        } catch (err) {
            Logger.warn("Not performed(findById-group), problems with connection");
            throw new Error("Not performed(findById-group), problems with connection");
        }
    }

    public static async addUser(
        connection: Connection,
        groupId: number,
        user: User,
        relations?: Array<string>,
    ): Promise<void> {
        try {
            const foundGroup1: Group = <Group>await GroupRepository.findById(connection, groupId, relations); //find group by id
            foundGroup1.userParticipate.push(user); //add user instance
        } catch (err) {
            Logger.warn("Not performed(addUser-Group), problems with connection");
            throw new Error("Not performed(addUser-Group), problems with connection");
        }
    }

    public static async removeUser(
        connection: Connection,
        groupId: number,
        user: User,
        relations?: Array<string>,
    ): Promise<void> {
        try {
            const foundGroup1: Group = <Group>await GroupRepository.findById(connection, groupId, relations); //find group by id
            foundGroup1.userParticipate = foundGroup1.userParticipate.filter(
                (existingUser: User) => existingUser.id !== user.id,
            );
        } catch (err) {
            Logger.warn("Not performed(addUser-Group), problems with connection");
            throw new Error("Not performed(addUser-Group), problems with connection");
        }
    }

    public static async create(group: Group): Promise<Group> {
        const now = new Date();
        const createdGroup: Group = new Group();

        createdGroup.name = group.name;
        createdGroup.password = group.password;
        createdGroup.createdAt = now;
        createdGroup.updatedAt = now;

        return createdGroup;
    }

    public static async save(connection: Connection, group: Group): Promise<Group> {
        group.updatedAt = new Date();
        return await GroupRepository.getRepository(connection).save(group);
    }
}

export { GroupRepository };

// const preparedElement = {};
// const filteredKeys: Array<string> = [];
// for (let key in user) {
//     // if (key !== "id") {
//     // && key !== "password") {
//     filteredKeys.push(key);
//     // }s
// }
// filteredKeys.forEach(key => (user ? (preparedElement[key] = user[key]) : void 0));
