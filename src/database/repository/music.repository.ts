import { Connection, DeleteResult, Repository } from "typeorm";
import { Logger } from "../../core";
import { Music } from "../model";
// import { KeystoreRepository } from "../repository";

class MusicRepository {
    public static getRepository(connection: Connection): Repository<Music> {
        try {
            return connection.getRepository(Music);
        } catch (err) {
            Logger.warn("Could not get repository User");
            throw new Error("Error accessing repository");
        }
    }

    public static async findById(connection: Connection, id: number, relations?: Array<string>): Promise<Music> {
        try {
            const song: Music = <Music>await MusicRepository.getRepository(connection).findOne({
                where: {
                    id,
                },
                relations,
            });
            return song;
        } catch (err) {
            Logger.warn("Not performed(findById-music), problems with connection");
            throw new Error("Not performed(findById-music), problems with connection");
        }
    }

    public static async findBySongName(
        connection: Connection,
        songName: string,
        relations?: Array<string>,
    ): Promise<Music> {
        try {
            const song: Music = <Music>await MusicRepository.getRepository(connection).findOne({
                where: {
                    songName,
                },
                relations,
            });
            return song;
        } catch (err) {
            Logger.warn("Not performed(findBySongName-song), problems with connection");
            throw new Error("Not performed(findBySongName-song), problems with connection");
        }
    }

    public static async create(connection: Connection, song: Music): Promise<Music> {
        const newSong: Music = new Music();

        newSong.songName = song.songName;
        newSong.fileName = song.fileName;

        return newSong;
    }

    public static async save(connection: Connection, song: Music): Promise<Music> {
        return await MusicRepository.getRepository(connection).save(song);
    }
}

export { MusicRepository };

// const preparedElement = {};
// const filteredKeys: Array<string> = [];
// for (let key in user) {
//     // if (key !== "id") {
//     // && key !== "password") {
//     filteredKeys.push(key);
//     // }s
// }
// filteredKeys.forEach(key => (user ? (preparedElement[key] = user[key]) : void 0));
