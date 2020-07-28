import { ArgumentParser, SubParser } from "argparse";
import { ICommand } from "../models/ICommand";
import { injectable } from "inversify";

@injectable()
export class ArgumentService {

    public parseArguments(): ICommand {
        // Argument Parser
        const argumentParser: ArgumentParser = new ArgumentParser({
            version: '1.0.0',
            addHelp: true,
            description: 'Description',
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
                help: 'The .json file containing the workspace information. Defaults to ./package.json'
            });
        version.addArgument(
            [ '-v', '--v', '-version', '--version' ],
            {
                action: 'store',
                dest: 'version',
                help: 'The version to set the workspace to.',
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
                help: ''
            });
        zip.addArgument(
            [ '-p', '--p', '-packageName', '--packageName' ],
            {
                action: 'store',
                dest: 'packageName',
                help: '',
                required: true
            });
        zip.addArgument(
            [ '-t', '--t', '-temp', '--temp' ],
            {
                action: 'store',
                defaultValue: './dest',
                dest: 'destFolder',
                help: ''
            }
        )

        return argumentParser.parseArgs();
    }

}
