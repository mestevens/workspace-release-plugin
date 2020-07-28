import { ICommand } from "../models/ICommand";

export interface ICommandHandler {
    execute(command: ICommand): void;
}
