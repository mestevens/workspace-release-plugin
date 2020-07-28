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

    public createFolder(folder: string, deleteIfExists?: boolean): void {
        const folderPath: string = path.resolve(folder);
        if (deleteIfExists) {
            this.remove(folder);
        }
        mkdirSync(folderPath);
    }

    public exists(path: PathLike): boolean {
        return existsSync(path);
    }

    public copy(src: string, dest: string): void {
        if (this.exists(src)) {
            copySync(src, dest, {overwrite: true});
        }
    }

    public remove(dir: string): void {
        if (this.exists(dir)) {
            removeSync(dir);
        }
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
        return zip.finalize();
    }

    public writePackage(path: PathLike, pkg: Package) {
        writeFileSync(path, JSON.stringify(pkg, this.jsonReplacer, 2));
    }

    private jsonReplacer(key: string, value: unknown): unknown {
        if (key === 'packagePath') {
            return undefined;
        }
        return value;
    }

}
