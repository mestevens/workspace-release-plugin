import { ICommand } from "./ICommand";

export interface ZipCommand extends ICommand {
    workspace: string;
    packageName: string;
    destFolder: string;
}
