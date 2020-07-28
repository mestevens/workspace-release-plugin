import { ICommandHandler } from "./ICommandHandler";
import { ZipCommand } from "../models/ZipCommand";
import path from "path";
import { FileService } from "../services/FileService";
import { PackageJsonService } from "../services/PackageJsonService";
import { WorkspaceService } from "../services/WorkspaceService";
import { Package } from "../models/Package";
import { injectable, inject } from "inversify";

@injectable()
export class ZipCommandHandler implements ICommandHandler {

    public constructor(
        @inject(FileService.name) private readonly fileService: FileService,
        @inject(PackageJsonService.name) private readonly packageJsonService: PackageJsonService,
        @inject(WorkspaceService.name) private readonly workspaceService: WorkspaceService
    ) {}

    public async execute(command: ZipCommand): Promise<void> {
        const destinationFolder: string = path.resolve(command.destFolder);
        try {
            // Get and validate the workspace package
            const workspacePackage: Package = this.packageJsonService.getPackageJson(command.workspace);
            this.workspaceService.validateWorkspacePackage(workspacePackage);

            // Make dest folder
            console.log(`Creating temporary folder ${destinationFolder}`);
            const nodeModulesFolder: string = path.join(destinationFolder, 'node_modules');
            this.fileService.createFolder(destinationFolder, true);

            // Copy workspace level node_modules (do this first)
            const workspaceFolder: string = path.dirname(workspacePackage.packagePath);
            const workspaceNodeModules: string = path.join(workspaceFolder, 'node_modules');
            console.log(`Copying workspace node_modules`);
            this.fileService.copy(workspaceNodeModules, nodeModulesFolder);

            // Remove workspace symlinks
            const workspacePackages: Package[] = this.workspaceService.getPackageJsons(workspacePackage);
            for (const symlink of workspacePackages) {
                this.fileService.unlink(path.join(destinationFolder, 'node_modules', symlink.name));
            }

            // Get package and move to directory
            const zipPackage: Package = this.workspaceService.getPackageFromName(command.packageName, workspacePackage);
            this.copyFiles(command.packageName, destinationFolder, nodeModulesFolder, workspacePackage);

            // Gather dependencies and copy to node_modules
            const dependencies: string[] = this.workspaceService.getWorkspaceDependencies(workspacePackage, zipPackage);
            for (const dependency of dependencies) {
                this.copyFiles(dependency, path.join(destinationFolder, 'node_modules', dependency), nodeModulesFolder, workspacePackage);
            }

            // Remove self from node_modules (don't want to include this as a package)
            console.log(`Removing self from dependencies`)
            const selfDependency: string = path.join(nodeModulesFolder, 'workspace-release-plugin');
            this.fileService.remove(selfDependency);

            // Zip
            const zipFile: string = path.join('./', `${zipPackage.name}-${zipPackage.version}.zip`);
            console.log(`Zipping to ${zipFile}`);
            await this.fileService.zip(destinationFolder, path.join('./', zipFile));
        } catch(ex) {
            throw ex;
        } finally {
            // Clean
            console.log(`Cleaning up temporary folder`);
            this.fileService.remove(destinationFolder);
        }
    }

    private copyFiles(packageName: string, destinationFolder: string, nodeModulesDestination: string, workspacePackage: Package) {
        console.log(`Copying package ${packageName} and dependencies`);

        // Get directory and Package to zip
        const zipPackage: Package = this.workspaceService.getPackageFromName(packageName, workspacePackage);
        const projectDirectory: string = path.dirname(zipPackage.packagePath);

        // Copy files
        const files: string[] = zipPackage.files || [];
        for (const file of files) {
            this.fileService.copy(path.join(projectDirectory, file), path.join(destinationFolder, file));
        }

        // Copy node_modules
        const nodeModulesPath: string = path.join(projectDirectory, 'node_modules');
        this.fileService.copy(nodeModulesPath, nodeModulesDestination);

        // Copy package.json
        this.fileService.copy(zipPackage.packagePath, path.join(destinationFolder, 'package.json'));
    }

}
