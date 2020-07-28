import { ICommandHandler } from "./ICommandHandler";
import { VersionCommand } from "../models/VersionCommand";
import { WorkspaceService } from "../services/WorkspaceService";
import { Package } from "../models/Package";
import { PackageJsonService } from "../services/PackageJsonService";
import { injectable, inject } from "inversify";
import { FileService } from "../services/FileService";

@injectable()
export class VersionCommandHandler implements ICommandHandler {

    public constructor(
        @inject(FileService.name) private readonly fileService: FileService,
        @inject(PackageJsonService.name) private readonly packageJsonService: PackageJsonService,
        @inject(WorkspaceService.name) private readonly workspaceService: WorkspaceService
    ) {}

    public execute(command: VersionCommand): void {
        // Get and validate the workspace package
        const workspacePackage: Package = this.packageJsonService.getPackageJson(command.workspace);
        this.workspaceService.validateWorkspacePackage(workspacePackage);

        // Get package.json info
        const pkgJsons: Package[] = this.workspaceService.getPackageJsons(workspacePackage);

        // Update package.json versions
        for (const pkg of pkgJsons) {
            const updatedPackageJson: Package = this.packageJsonService.updateVersions(pkg, pkgJsons, command.version);
            this.fileService.writePackage(pkg.packagePath, updatedPackageJson);
        }
    }

}
