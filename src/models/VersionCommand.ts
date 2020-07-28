import { ICommand } from "./ICommand";

export interface VersionCommand extends ICommand {
    workspace: string;
    version: string;
}
