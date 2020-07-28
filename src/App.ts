import { ArgumentService } from "./services/ArgumentService";
import { ICommandHandler } from "./commands/ICommandHandler";
import { VersionCommandHandler } from "./commands/VersionCommandHandler";
import { ICommand } from "./models/ICommand";
import { ZipCommandHandler } from "./commands/ZipCommandHandler";
import { inject, injectable } from "inversify";

@injectable()
export class App {

    private readonly commandMap: Map<string, ICommandHandler>;

    public constructor(
        @inject(ArgumentService.name) private readonly argumentService: ArgumentService,
        @inject(VersionCommandHandler.name) versionCommandHandler: VersionCommandHandler,
        @inject(ZipCommandHandler.name) zipCommandHandler: ZipCommandHandler
    ) {
        // Set up command map
        this.commandMap = new Map<string, ICommandHandler>([
            [ 'version', versionCommandHandler ],
            [ 'zip', zipCommandHandler ]
        ]);
    }

    public run() {
        // Parse arguments
        const command: ICommand = this.argumentService.parseArguments();

        // Find and execute command
        if (this.commandMap.has(command.name)) {
            this.commandMap.get(command.name)!.execute(command as unknown as ICommand);
        }
    }

}
