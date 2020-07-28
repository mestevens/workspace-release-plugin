import { PackageJsonService } from "./PackageJsonService";
import { Package } from "../models/Package";
import path from "path";
import { injectable, inject } from "inversify";

@injectable()
export class WorkspaceService {

    public constructor(
        @inject(PackageJsonService.name) private readonly packageJsonService: PackageJsonService
    ) {}

    public validateAndReturnWorkspacePath(packageJsonPath: string): string {
        return path.resolve(packageJsonPath);
    }

    public validateAndReturnWorkspacePackage(packageJsonPath: string): Package {
        const packageJsonString: string = this.validateAndReturnWorkspacePath(packageJsonPath);
        return this.packageJsonService.getPackageJson(packageJsonString);
    }

    public getPackageJsons(packageJson: Package): string[] {
        const packageJsonPaths: string[] = [];
        for (const workspace of packageJson.workspaces || []) {
            const packages: string[] = this.packageJsonService.findPackageJson(workspace);
            for (const workspacePackageJson of packages) {
                packageJsonPaths.push(workspacePackageJson);
            }
        }
        return packageJsonPaths;
    }

    public getPackageNames(packageJsonPaths: string[]): string[] {
        return packageJsonPaths.map((path) => this.packageJsonService.findPackageName(path));
    }

    public getPackagePathFromName(packageName: string, workspacePackage: Package): string {
        const paths: string[] = this.getPackageJsons(workspacePackage);
        for (const path of paths) {
            const json: Package = this.packageJsonService.getPackageJson(path);
            if (json.name === packageName) {
                return path;
            }
        }
        throw new Error(`Could not find package named ${packageName} in workspace.`);
    }

    public getPackageFromName(packageName: string, workspacePackage: Package): Package {
        const packagePath: string = this.getPackagePathFromName(packageName, workspacePackage);
        return this.packageJsonService.getPackageJson(packagePath);
    }

    public getWorkspaceDependencies(workspacePackage: Package, projectPackage: Package): string[] {
        // Get package.json info
        const packageJsonPaths: string[] = this.getPackageJsons(workspacePackage);
        const packageNames: string[] = this.getPackageNames(packageJsonPaths);

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
