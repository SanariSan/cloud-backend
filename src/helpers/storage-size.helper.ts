import { EUSER_PRIVELEGE_RELATIONS } from "../database/connection";
import { UserPrivelegeRepository, UserRepository } from "../database/repositories";

const defaultSizeMax = parseInt(<string>process.env.DEFAULT_STORAGE_SIZE_MB);

export async function calculateCurrentMaxStorageSize(
	userRepository: UserRepository,
	userPrivelegeRepository: UserPrivelegeRepository,
): Promise<number> {
	const userRecord = userRepository.getRecord();
	if (!userRecord) throw new Error();
	if (!userRecord.userPrivelege) throw new Error();

	await userPrivelegeRepository.findById(userRecord.userPrivelege.id, [
		EUSER_PRIVELEGE_RELATIONS.PRIVELEGE_100,
		EUSER_PRIVELEGE_RELATIONS.PRIVELEGE_500,
	]);

	const userPrivelegeRecord = userPrivelegeRepository.getRecord();
	if (!userPrivelegeRecord) throw new Error();

	await userPrivelegeRepository.filterOutdatedPriveleges().saveRecord();

	const amountOfGbFromPriveleges100 = userPrivelegeRecord.privelege100.reduce(
		(acc) => acc + 100 * 1000,
		0,
	);
	const amountOfGbFromPriveleges500 = userPrivelegeRecord.privelege500.reduce(
		(acc) => acc + 500 * 1000,
		0,
	);

	return defaultSizeMax + amountOfGbFromPriveleges100 + amountOfGbFromPriveleges500;
}
