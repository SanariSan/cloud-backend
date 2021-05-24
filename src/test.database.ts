import { Connection } from "typeorm";
import {
    ENTITIES,
    IUserManual,
    KeystoreRepository,
    IKeystoreManual,
    UserRepository,
    GroupRepository,
    IGroupManual,
} from "./database";
import { getNewConnection } from "./helpers";

async function test() {
    const newUserData: IUserManual = {
        name: "test",
        email: "test",
        profilePicUrl: "test_url",
        password: "test_hash",
    };

    const newKeystoreData: IKeystoreManual = {
        accessTokenKey: "12345",
        refreshTokenKey: "54321",
    };

    const newGroupData: IGroupManual = {
        name: "Group1",
        password: "pass1",
    };

    const connection: Connection = await getNewConnection([ENTITIES.USER, ENTITIES.KEYSTORE, ENTITIES.GROUP]);
    const userRepository = await new UserRepository()
        .initializeRepository(connection)
        .createUser(newUserData)
        .saveRecord();

    const keystoreRepository = await new KeystoreRepository()
        .initializeRepository(connection)
        .createKeystore(newKeystoreData)
        .saveRecord();
    const groupRepository = await new GroupRepository()
        .initializeRepository(connection)
        .createGroup(newGroupData)
        .saveRecord();

    await userRepository
        .addKeystore(keystoreRepository.getRecord())
        .addGroupOwnage(groupRepository.getRecord())
        .saveRecord();

    await groupRepository.addUser(userRepository.getRecord()).saveRecord();

    console.log(userRepository.getRecord());
    console.log(keystoreRepository.getRecord());
    console.log(groupRepository.getRecord());
}

export { test };
