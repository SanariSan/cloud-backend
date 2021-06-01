import path from "path";
import fs from "fs";
import util from "util";
import { BadRequestError } from "./api-error.core";
import { IFsFnArgs } from "./types.type";

//------------------------------

const accessAsync = util.promisify(fs.access);
const renameAsync = util.promisify(fs.rename);
const statAsync = util.promisify(fs.stat);
const readdirAsync = util.promisify(fs.readdir);
const mkdirAsync = util.promisify(fs.mkdir);
const rmAsync = util.promisify(fs.rm);

const storageDir = "/home/me/Code/REVIEW/ts-pg-express/storage";

//-------------------------------

export async function createFolder({ userDir, pathA, pathB }: IFsFnArgs) {
	//don't need existing path, because of recursive
	const targetPath = path.join(storageDir, userDir, pathB);

	await mkdirAsync(targetPath, {
		recursive: true,
	});
}

export async function readFolder({ userDir, pathA, pathB }: IFsFnArgs): Promise<any> {
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

export async function renameFolder({ userDir, pathA, pathB }: IFsFnArgs) {
	const existingPath = path.join(storageDir, userDir, pathA);
	const targetPath = path.join(existingPath, userDir, pathB);

	const statObjOld = await statAsync(existingPath);
	const statObjNew = await statAsync(targetPath).catch((err) => void 0);

	if (statObjOld && !statObjNew) {
		await renameAsync(existingPath, targetPath);
	}
}

//------------------------------

export async function deleteFileFolder({ userDir, pathA, pathB }: IFsFnArgs) {
	const existingPath = path.join(storageDir, userDir, pathA);

	await rmAsync(existingPath, {
		recursive: true,
	});
}

//------------------------------

export async function createFile({ userDir, pathA, pathB }: IFsFnArgs) {}
export async function readFile({ userDir, pathA, pathB }: IFsFnArgs) {}
export async function renameFile({ userDir, pathA, pathB }: IFsFnArgs) {}
export async function deleteFile({ userDir, pathA, pathB }: IFsFnArgs) {}
