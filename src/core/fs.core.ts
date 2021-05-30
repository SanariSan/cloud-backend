import path from "path";
import fs from "fs";
const storageDir = "/home/me/Code/REVIEW/ts-pg-express/storage";

async function createFolder(userDir, pathToContainingFolder, folderToCreate) {
	path.join(storageDir, userDir, pathToContainingFolder);
}
async function readFolder(userDir, pathToContainingFolder) {}
async function renameFolder(userDir, pathToTargetFolder) {}
async function deleteFolder(userDir, pathToTargetFolder) {}

async function createFile() {}
async function readFile() {}
async function renameFile() {}
async function deleteFile() {}

//todo - move file / folder
