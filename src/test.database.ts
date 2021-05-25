import {
    IUserManualInput,
    KeystoreRepository,
    IKeystoreManualInput,
    UserRepository,
    GroupRepository,
    IGroupManualInput,
    DBManager,
    ENTITIES,
} from "./database";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function test() {
    const newUserData: IUserManualInput = {
        name: "test",
        email: "test",
        profilePicUrl: "test_url",
        password: "test_hash",
    };

    const newKeystoreData: IKeystoreManualInput = {
        accessTokenKey: "12345",
        refreshTokenKey: "54321",
    };

    const newGroupData: IGroupManualInput = {
        name: "Group1",
        password: "pass1",
    };

    const dbManager: DBManager = await new DBManager([
        ENTITIES.USER,
        ENTITIES.KEYSTORE,
        ENTITIES.GROUP,
    ]).createConnection();

    const userRepository = await new UserRepository(dbManager).createUser(newUserData).saveRecord();
    const keystoreRepository = await new KeystoreRepository(dbManager).createKeystore(newKeystoreData).saveRecord();
    const groupRepository = await new GroupRepository(dbManager).createGroup(newGroupData).saveRecord();

    await userRepository
        .addKeystore(keystoreRepository.getRecord())
        .addGroupOwnage(groupRepository.getRecord())
        .saveRecord();

    await groupRepository.addUser(userRepository.getRecord()).saveRecord();

    // console.log(userRepository.getRecord());
    // console.log(keystoreRepository.getRecord());
    // console.log(groupRepository.getRecord());

    let user = await userRepository
        .findByEmail("test")
        .then(_ => _.getRecord())
        .catch(e => {
            console.log(e);
        });
    if (user) console.log(user);

    // await sleep(8000);

    // let user1 = await userRepository
    //     .findByEmail("test")
    //     .then(_ => _.getRecord())
    //     .catch(e => {
    //         console.log(e);
    //     });
    // if (user1) console.log(user);
}

export { test };
