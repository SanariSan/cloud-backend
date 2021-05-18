import { Response, NextFunction } from "express";
import { ConnectionOptions } from "typeorm";
import { InternalError, StreamResponse, SuccessResponse } from "../../../../core";
import { ProtectedRequest } from "../../../../types";
import { DBManager, Music, MusicRepository } from "../../../../database";
import config from "config";
import fs from "fs";
import path from "path";

export const Profile1 = async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    // return new SuccessResponse("Test passed", {
    //     user: req.user,
    //     keystore: req.keystore,
    //     accessToken: req.accessToken,
    // }).send(res);

    const options: ConnectionOptions = config.get("db.auth");
    const dbManager: DBManager = new DBManager(options, [Music]);
    const connection = (await dbManager.createConnection()).getConnection();

    let song: Music;
    try {
        song = await MusicRepository.findBySongName(connection, "sound1");
    } catch (err) {
        throw new InternalError();
    }
    const stream = fs.createReadStream(path.join(__dirname, "../../../../../music-src/", song.fileName));
    stream.on("data", data => {
        new StreamResponse<Buffer>("", data).send(res);
    });
    stream.on("close", () => {
        res.end();
    });
};
