import { EUSER_PRIVELEGE_RELATIONS, UserPrivelegeRepository, UserRepository } from "../database";

export async function calculateCurrentStorageSize(
	userRepository: UserRepository,
	userPrivelegeRepository: UserPrivelegeRepository,
): Promise<number> {
	const userRecord = userRepository.getRecord();
	if (!userRecord) throw new Error();
	if (!userRecord.userPrivelege) throw new Error(); //CREATE IT ON GROUP CREATION!!!!!!!!

	await userPrivelegeRepository.findById(userRecord.userPrivelege.id, [
		EUSER_PRIVELEGE_RELATIONS.PRIVELEGE_100,
		EUSER_PRIVELEGE_RELATIONS.PRIVELEGE_500,
	]);

	const userPrivelegeRecord = userPrivelegeRepository.getRecord();
	if (!userPrivelegeRecord) throw new Error();
	console.log(userPrivelegeRecord);

	await userPrivelegeRepository.filterOutdatedPriveleges().saveRecord();

	console.log(userPrivelegeRecord);
	const amountOfGbFromPriveleges100 = userPrivelegeRecord.privelege100.reduce(
		(acc) => acc + 100,
		0,
	);
	const amountOfGbFromPriveleges500 = userPrivelegeRecord.privelege500.reduce(
		(acc) => acc + 500,
		0,
	);

	return amountOfGbFromPriveleges100 + amountOfGbFromPriveleges500;
}
