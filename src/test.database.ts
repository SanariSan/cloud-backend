import {
    IUserManualInput,
    KeystoreRepository,
    IKeystoreManualInput,
    UserRepository,
    GroupRepository,
    IGroupManualInput,
    DBManager,
    ENTITIES,
    IGroupPathManualInput,
    UserPrivelegeRepository,
    Privelege100Repository,
    GroupPathRepository,
    Privelege500Repository,
} from "./database";

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function test() {
    const dbManager: DBManager = await new DBManager([
        ENTITIES.USER,
        ENTITIES.KEYSTORE,
        ENTITIES.GROUP,
        ENTITIES.GROUP_PATH,
        ENTITIES.USER_PRIVELEGE,
        ENTITIES.PRIVELEGE_100,
        ENTITIES.PRIVELEGE_500,
    ]).createConnection();

    const newUserData: IUserManualInput = {
        name: "test",
        email: "test@mail.ru",
        profilePicUrl: "test_url",
        password: "test_hash",
    };
    const newKeystoreData: IKeystoreManualInput = {
        accessTokenKey: "12345",
        refreshTokenKey: "54321",
    };
    const newGroup: IGroupManualInput = {
        name: "Group1",
        password: "pass1",
    };
    const newGroupPath: IGroupPathManualInput = {
        pathName: "test@mail.ru",
        sizeUsed: 0,
        sizeMax: 15,
    };

    const userRepository = await new UserRepository(dbManager).createUser(newUserData).saveRecord();
    const keystoreRepository = await new KeystoreRepository(dbManager).createKeystore(newKeystoreData).saveRecord();
    const groupRepository = await new GroupRepository(dbManager).createGroup(newGroup).saveRecord();
    const userPrivelegeRepository = await new UserPrivelegeRepository(dbManager).createUserPrivelege().saveRecord();
    const groupPathRepository = await new GroupPathRepository(dbManager).createGroupPath(newGroupPath).saveRecord();
    const privelege100Repository = await new Privelege100Repository(dbManager).createPrivelege100().saveRecord();
    const privelege500Repository = await new Privelege500Repository(dbManager).createPrivelege500().saveRecord();

    await userRepository
        .addKeystore(keystoreRepository.getRecord())
        .addGroupOwnage(groupRepository.getRecord())
        .addGroupParticipance(groupRepository.getRecord())
        .addUserPrivelege(userPrivelegeRepository.getRecord())
        .saveRecord();

    await groupRepository
        .addUser(userRepository.getRecord())
        .addPathOwnage(groupPathRepository.getRecord())
        .saveRecord();

    await userPrivelegeRepository
        .addPrivelege100(privelege100Repository.getRecord())
        .addPrivelege500(privelege500Repository.getRecord())
        .saveRecord();

    console.log(userRepository.getRecord());
    console.log(keystoreRepository.getRecord());
    console.log(groupRepository.getRecord());
    console.log(groupPathRepository.getRecord());
    console.log(userPrivelegeRepository.getRecord());
    console.log(privelege100Repository.getRecord());
    console.log(privelege500Repository.getRecord());

    // let user = await userRepository
    //     .findByEmail("test")
    //     .then(_ => _.getRecord())
    //     .catch(e => {
    //         console.log(e);
    //     });
    // if (user) console.log(user);

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
