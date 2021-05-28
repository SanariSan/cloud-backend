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
	EUSER_RELATIONS,
} from "./database";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
	const keystoreRepository = await new KeystoreRepository(dbManager)
		.createKeystore(newKeystoreData)
		.saveRecord();
	const groupRepository = await new GroupRepository(dbManager).createGroup(newGroup).saveRecord();
	const userPrivelegeRepository = await new UserPrivelegeRepository(dbManager)
		.createUserPrivelege()
		.saveRecord();
	const groupPathRepository = await new GroupPathRepository(dbManager)
		.createGroupPath(newGroupPath)
		.saveRecord();
	const privelege100Repository = await new Privelege100Repository(dbManager)
		.createPrivelege100()
		.saveRecord();
	const privelege500Repository = await new Privelege500Repository(dbManager)
		.createPrivelege500()
		.saveRecord();

	const keystoreRecord = keystoreRepository.getRecord();
	if (!keystoreRecord) throw new Error();

	const groupRecord = groupRepository.getRecord();
	if (!groupRecord) throw new Error();

	const userPrivelegeRecord = userPrivelegeRepository.getRecord();
	if (!userPrivelegeRecord) throw new Error();

	await userRepository
		.addKeystore(keystoreRecord)
		.addGroupOwnage(groupRecord)
		.addGroupParticipance(groupRecord)
		.addUserPrivelege(userPrivelegeRecord)
		.saveRecord();

	const userRecord = userRepository.getRecord();
	if (!userRecord) throw new Error();

	const groupPathRecord = groupPathRepository.getRecord();
	if (!groupPathRecord) throw new Error();

	const privelege100Record = privelege100Repository.getRecord();
	if (!privelege100Record) throw new Error();

	const privelege500Record = privelege500Repository.getRecord();
	if (!privelege500Record) throw new Error();

	await groupRepository.addUser(userRecord).addPathOwnage(groupPathRecord).saveRecord();
	await userPrivelegeRepository
		.addPrivelege100(privelege100Record)
		.addPrivelege500(privelege500Record)
		.saveRecord();

	console.log(userRepository.getRecord());
	console.log(keystoreRepository.getRecord());
	console.log(groupRepository.getRecord());
	console.log(groupPathRepository.getRecord());
	console.log(userPrivelegeRepository.getRecord());
	console.log(privelege100Repository.getRecord());
	console.log(privelege500Repository.getRecord());

	await userRepository.findByIds([], [EUSER_RELATIONS.GROUP_OWNAGE]);
	const userRecords = userRepository.getRecords();
	if (!userRecords) throw new Error();

	// console.log(userRecords);

	// console.log("_________");
	// const usersWithTargetGroupRecords = userRecords
	//     .filter(el => el.groupOwnage)
	//     .filter(el => el.groupOwnage.name === "Group1");
	// console.log(usersWithTargetGroupRecords);
}

export { test };
