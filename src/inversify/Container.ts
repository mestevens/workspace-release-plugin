import { Container as InversifyContainer } from 'inversify';
import { ArgumentService } from '../services/ArgumentService';
import { FileService } from '../services/FileService';
import { PackageJsonService } from '../services/PackageJsonService';
import { WorkspaceService } from '../services/WorkspaceService';
import { VersionCommandHandler } from '../commands/VersionCommandHandler';
import { ZipCommandHandler } from '../commands/ZipCommandHandler';

export class Container extends InversifyContainer {

    public constructor() {
        super();

        // Services
        this.bind<ArgumentService>(ArgumentService.name)
            .to(ArgumentService)
            .inSingletonScope();
        this.bind<FileService>(FileService.name)
            .to(FileService)
            .inSingletonScope();
        this.bind<PackageJsonService>(PackageJsonService.name)
            .to(PackageJsonService)
            .inSingletonScope();
        this.bind<WorkspaceService>(WorkspaceService.name)
            .to(WorkspaceService)
            .inSingletonScope();

        // Commands
        this.bind<VersionCommandHandler>(VersionCommandHandler.name)
            .to(VersionCommandHandler)
            .inSingletonScope();
        this.bind<ZipCommandHandler>(ZipCommandHandler.name)
            .to(ZipCommandHandler)
            .inSingletonScope();
    }

}
