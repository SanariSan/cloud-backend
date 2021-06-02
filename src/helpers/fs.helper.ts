import { BadRequestError } from "../core";

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
