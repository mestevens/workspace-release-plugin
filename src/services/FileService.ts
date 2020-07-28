import path from "path";
import {
    mkdirSync,
    copySync,
    existsSync,
    PathLike,
    removeSync,
    unlinkSync,
    lstatSync,
    createWriteStream,
    WriteStream,
    writeFileSync
} from "fs-extra";
import { injectable } from "inversify";
import archiver, { Archiver } from "archiver";
import { Package } from "../models/Package";

@injectable()
export class FileService {

    public createFolder(folder: string): void {
        const folderPath: string = path.resolve(folder);
        mkdirSync(folderPath);
    }

    public exists(path: PathLike): boolean {
        return existsSync(path);
    }

    public copy(src: string, dest: string): void {
        copySync(src, dest, {overwrite: true});
    }

    public remove(dir: string): void {
        removeSync(dir);
    }

    public unlink(path: PathLike): void {
        if (lstatSync(path).isSymbolicLink()) {
            unlinkSync(path)
        }
    }

    public async zip(src: string, dest: PathLike): Promise<void> {
        const output: WriteStream = createWriteStream(dest);
        const zip: Archiver = archiver('zip');
        zip.pipe(output);
        zip.directory(src, false);
        zip.finalize();
    }

    public writePackage(path: PathLike, pkg: Package) {
        writeFileSync(path, JSON.stringify(pkg, null, 2));
    }

}
