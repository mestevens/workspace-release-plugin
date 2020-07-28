import { ArgumentParser, SubParser } from "argparse";
import { ICommand } from "../models/ICommand";
import { injectable } from "inversify";

@injectable()
export class ArgumentService {

    private static readonly HELP_TEXT: Map<string, string> = new Map<string, string>([
        ['workspace', 'The .json file containing the workspace information. Defaults to ./package.json'],
        ['version', 'The version to set the workspace to'],
        ['packageName', 'The package to zip'],
        ['destFolder', 'The temporary folder where all the operations for zipping are done']
    ]);

    public parseArguments(): ICommand {
        // Argument Parser
        const argumentParser: ArgumentParser = new ArgumentParser({
            version: '1.0.0',
            addHelp: true,
            description: 'A plugin to help deal with versioning and packaging yarn workspaces.',
        });

        // Sub parser
        const subparsers: SubParser = argumentParser.addSubparsers({
            title: 'subcommands',
            dest: 'name'
        });

        // Version
        const version: ArgumentParser = subparsers.addParser('version', {addHelp:true});
        version.addArgument(
            [ '-w', '--w', '-workspace', '--workspace' ],
            {
                action: 'store',
                defaultValue: './package.json',
                dest: 'workspace',
                help: ArgumentService.HELP_TEXT.get('workspace')
            });
        version.addArgument(
            [ '-v', '--v', '-version', '--version' ],
            {
                action: 'store',
                dest: 'version',
                help: ArgumentService.HELP_TEXT.get('version'),
                required: true
            }
        )

        // Zip
        const zip: ArgumentParser = subparsers.addParser('zip', {addHelp: true});
        zip.addArgument(
            [ '-w', '--w', '-workspace', '--workspace' ],
            {
                action: 'store',
                defaultValue: './package.json',
                dest: 'workspace',
                help: ArgumentService.HELP_TEXT.get('workspace')
            });
        zip.addArgument(
            [ '-p', '--p', '-packageName', '--packageName' ],
            {
                action: 'store',
                dest: 'packageName',
                help: ArgumentService.HELP_TEXT.get('packageName'),
                required: true
            });
        zip.addArgument(
            [ '-t', '--t', '-temp', '--temp' ],
            {
                action: 'store',
                defaultValue: './dest',
                dest: 'destFolder',
                help: ArgumentService.HELP_TEXT.get('destFolder')
            }
        )

        return argumentParser.parseArgs();
    }

}
