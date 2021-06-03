import path from "path";
import fs from "fs";
import util from "util";
import config from "config";

//------------------------------

const storageDir = <string>config.get("storageDirectory");

const renameAsync = util.promisify(fs.rename);
const statAsync = util.promisify(fs.stat);
const readdirAsync = util.promisify(fs.readdir);
const mkdirAsync = util.promisify(fs.mkdir);
const rmAsync = util.promisify(fs.rm);

//-------------------------------

export async function createFolder({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA?: string;
	pathB: string;
}) {
	//don't need existing path, because of recursive
	const targetPath = path.join(storageDir, userDir, pathB);

	await mkdirAsync(targetPath, {
		recursive: true,
	});
}

export async function readFolder({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA: string;
	pathB?: string;
}): Promise<any> {
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

export async function renameFolder({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA: string;
	pathB: string;
}) {
	const existingPath = path.join(storageDir, userDir, pathA);
	const targetPath = path.join(existingPath, userDir, pathB);

	const statObjOld = await statAsync(existingPath);
	const statObjNew = await statAsync(targetPath).catch((err) => void 0);

	if (statObjOld && !statObjNew) {
		await renameAsync(existingPath, targetPath);
	}
}

//------------------------------

export async function deleteFileFolder({
	userDir,
	pathA,
	pathB,
}: {
	userDir: string;
	pathA: string;
	pathB?: string;
}) {
	const existingPath = path.join(storageDir, userDir, pathA);

	await rmAsync(existingPath, {
		recursive: true,
	});
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
	req: any;
}) {
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
	const existingPath = path.join(storageDir, userDir, pathA, pathB);

	return statAsync(existingPath);
}
// export async function renameFile({ userDir, pathA, pathB }: IFsFnArgs) {}
