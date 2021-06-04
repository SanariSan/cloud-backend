import fs from "fs";
import path from "path";
import util from "util";
import { BadRequestError } from "../core";

const lstat = util.promisify(fs.lstat);
const readdir = util.promisify(fs.readdir);

export const handleFs = (execution: Function) => (arg: any) =>
	execution(arg).catch((err) => {
		if (err && err.code === "ENOENT") {
			//not found
			throw new BadRequestError("No such directory");
		}
		if (err && err.code === "ENOTDIR") {
			//path to file, not dir
			throw new BadRequestError("Expected directory, got file instead");
		}
		if (err && err.code === "EEXIST") {
			//entity already exists
			throw new BadRequestError(
				"Object you are trying to create has already been created before",
			);
		}

		throw err;
	});

export const getItemsSize = async (rootItemPath) => {
	const fileSizes = new Map();

	async function processItem(itemPath) {
		const stats = await lstat(itemPath);

		fileSizes.set(stats.ino, stats.size);

		if (stats.isDirectory()) {
			const directoryItems = await readdir(itemPath);

			//if it's directory - recursively for every file
			await Promise.all(
				directoryItems.map((directoryItem) =>
					processItem(path.join(itemPath, directoryItem)),
				),
			);
		}
	}

	//recursively call fn
	await processItem(rootItemPath);

	const finalSize = Array.from(fileSizes.values()).reduce(
		(total, fileSize) => total + fileSize,
		0,
	);

	//mb
	return finalSize / 1000 / 1000;
};
