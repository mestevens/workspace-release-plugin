import { PackageJsonService } from "./PackageJsonService";
import { Package } from "../models/Package";
import path from "path";
import { injectable, inject } from "inversify";

@injectable()
export class WorkspaceService {

    public constructor(
        @inject(PackageJsonService.name) private readonly packageJsonService: PackageJsonService
    ) {}

    public validateWorkspacePackage(workspacePackage: Package): void {
        // If no workspaces just exit
        if (!workspacePackage.workspaces) {
            console.warn(`No workspaces found.`);
            process.exit();
        }
    }

    public getPackageJsons(packageJson: Package): Package[] {
        const packageJsonPaths: string[] = [];
        const rootDirectory: string = path.dirname(packageJson.packagePath);
        for (const workspace of packageJson.workspaces || []) {
            const packages: string[] = this.packageJsonService.findPackageJson(rootDirectory, workspace);
            for (const workspacePackageJson of packages) {
                packageJsonPaths.push(workspacePackageJson);
            }
        }
        return packageJsonPaths.map((path) => this.packageJsonService.getPackageJson(path));;
    }

    public getPackageNames(packageJsonPaths: string[]): string[] {
        return packageJsonPaths.map((path) => this.packageJsonService.findPackageName(path));
    }

    public getPackageFromName(packageName: string, workspacePackage: Package): Package {
        const pkgs: Package[] = this.getPackageJsons(workspacePackage);
        for (const pkg of pkgs) {
            if (pkg.name === packageName) {
                return pkg;
            }
        }
        throw new Error(`Could not find package named ${packageName} in workspace.`);
    }

    public getWorkspaceDependencies(workspacePackage: Package, projectPackage: Package): string[] {
        // Get package.json info
        const pkgs: Package[] = this.getPackageJsons(workspacePackage);
        const packageNames: string[] = pkgs.map((p) => p.name);

        // Get workspace dependencies
        let dependencies: Set<string> = new Set<string>();
        if (projectPackage.dependencies) {
            for (const dependency of Object.keys(projectPackage.dependencies)) {
                // If it's in the workspace add it and check it's dependencies
                if (packageNames.includes(dependency)) {
                    const dependencyDependencies: string[] = this.getWorkspaceDependencies(workspacePackage, this.getPackageFromName(dependency, workspacePackage));
                    dependencies = new Set<string>([ ...dependencies, dependency, ...dependencyDependencies]);
                }
            }
        }

        return [ ...dependencies ];
    }

}
