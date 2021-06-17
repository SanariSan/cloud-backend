import { Request } from "express";
import fs from "fs";
// import { checkMalicious } from "../helpers";
import path from "path";
import util from "util";

//------------------------------

const storageDir = <string>process.env.STORAGE_DIRECTORY;

const renameAsync = util.promisify(fs.rename);
const statAsync = util.promisify(fs.stat);
const readdirAsync = util.promisify(fs.readdir);
const mkdirAsync = util.promisify(fs.mkdir);
const rmAsync = util.promisify(fs.rm);

//-------------------------------

const UP_PATH_REGEXP = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
const checkMalicious = (filePath) => {
	if (UP_PATH_REGEXP.test(filePath)) throw new Error("Bad path");
};

export async function createFolder({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA: string;
	pathB: string;
}) {
	checkMalicious(pathA);
	checkMalicious(pathB);

	const existingPath = path.join(storageDir, userDir, pathA);
	const targetPath = path.join(storageDir, userDir, pathB);

	const statObjContaining = await statAsync(existingPath);
	const statObjNew = await statAsync(targetPath).catch((err) => void 0);

	if (statObjContaining && !statObjNew) {
		await mkdirAsync(targetPath);
	}
}

export async function readFolder({ userDir, pathA }: { userDir: string; pathA: string }): Promise<{
	files: Array<string>;
	folders: Array<string>;
}> {
	checkMalicious(pathA);

	const existingPath = path.join(storageDir, userDir, pathA);
	const output: {
		files: Array<string>;
		folders: Array<string>;
	} = {
		files: [],
		folders: [],
	};

	const filesNames: Array<string> = await readdirAsync(existingPath);

	for (let entityName of filesNames) {
		const targetPath = path.join(existingPath, entityName);
		const fileInfo = await statAsync(targetPath);

		if (fileInfo.isFile()) {
			output.files.push(entityName);
		}
		if (fileInfo.isDirectory()) {
			output.folders.push(entityName);
		}
	}

	return output;
}

//------------------------------

export async function renameFileFolder({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA: string;
	pathB: string;
}) {
	checkMalicious(pathA);
	checkMalicious(pathB);

	const existingPath = path.join(storageDir, userDir, pathA);
	const targetPath = path.join(storageDir, userDir, pathB);

	const statObjOld = await statAsync(existingPath);
	const statObjNew = await statAsync(targetPath).catch((err) => void 0);

	if (statObjOld && !statObjNew) {
		await renameAsync(existingPath, targetPath);
	}
}

export async function deleteFileFolder({ userDir, pathA }: { userDir: string; pathA: string }) {
	checkMalicious(pathA);

	const existingPath = path.join(storageDir, userDir, pathA);
	const statObj = await statAsync(existingPath).catch((err) => void 0);

	if (statObj) {
		await rmAsync(existingPath, {
			recursive: true,
		});
	}
}

//------------------------------

export function createFile({
	userDir,
	pathA,
	pathB,
	req,
}: {
	userDir: string;
	pathA: string;
	pathB: string;
	req: Request;
}) {
	checkMalicious(pathA);
	checkMalicious(pathB);

	return new Promise((resolve, reject) => {
		const existingPath = path.join(storageDir, userDir, pathA, pathB);
		const writable = fs.createWriteStream(existingPath, {
			highWaterMark: 1 * 1024,
			encoding: "binary",
			flags: "wx",
		});

		writable.on("error", (err) => {
			if (err) reject(err);
		});

		req.on("data", (data) => {
			writable.write(data, (err) => {
				if (err) reject(err);
			});
		});

		req.on("end", resolve);
	});
}

//------------------------------

export async function checkExists({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA: string;
	pathB: string;
}) {
	checkMalicious(pathA);
	checkMalicious(pathB);

	const existingPath = path.join(storageDir, userDir, pathA, pathB);

	return statAsync(existingPath);
}
