import { ICommandHandler } from "./ICommandHandler";
import { VersionCommand } from "../models/VersionCommand";
import { WorkspaceService } from "../services/WorkspaceService";
import { Package } from "../models/Package";
import { DependencyService } from "../services/DependencyService";
import { PackageJsonService } from "../services/PackageJsonService";
import { injectable, inject } from "inversify";

@injectable()
export class VersionCommandHandler implements ICommandHandler {

    public constructor(
        @inject(DependencyService.name) private readonly dependencyService: DependencyService,
        @inject(PackageJsonService.name) private readonly packageJsonService: PackageJsonService,
        @inject(WorkspaceService.name) private readonly workspaceService: WorkspaceService
    ) {}

    public execute(command: VersionCommand): void {
        // Get the workspace package
        const workspacePackage: Package = this.workspaceService.validateAndReturnWorkspacePackage(command.workspace);
        
        // If no workspaces just exit
        if (!workspacePackage.workspaces) {
            console.warn(`No workspaces found.`);
            process.exit();
        }

        // Get package.json info
        const packageJsonPaths: string[] = this.workspaceService.getPackageJsons(workspacePackage);
        const packageNames: string[] = this.workspaceService.getPackageNames(packageJsonPaths);

        // Update package.json versions
        for (const packageJsonPath of packageJsonPaths) {
            const json: Package = this.packageJsonService.getPackageJson(packageJsonPath);
            const updatedPackageJson: Package = this.dependencyService.updateVersions(json, packageNames, command.version);

            // TODO write
            console.log(updatedPackageJson);
        }
    }

}
