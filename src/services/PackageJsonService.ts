import { glob } from "glob";
import { Package } from "../models/Package";
import { injectable, inject } from "inversify";
import { FileService } from "./FileService";

@injectable()
export class PackageJsonService {

    public constructor(
        @inject(FileService.name) private readonly fileService: FileService
    ) {}

    public findPackageJson(rootDirectory: string, workspace: string): string[] {
        return glob.sync(`${rootDirectory}/${workspace}/package.json`, {
            ignore: `${rootDirectory}/${workspace}/**/node_modules/**/package.json`
        });
    }

    public findPackageName(packageJson: string): string {
        const json: Package = this.getPackageJson(packageJson);
        return json.name;
    }

    public getPackageJson(packageJson: string): Package {
        // Get the package and add the path to it
        const pkg: Package = this.fileService.readPackage(packageJson);
        pkg.packagePath = packageJson;
        return pkg;
    }

    public updateVersions(packageJson: Package, workspacePackages: Package[], version: string): Package {
        packageJson.version = version;
        if (packageJson.dependencies) {
            for (const workspacePackage of workspacePackages) {
                if (packageJson.dependencies[workspacePackage.name]) {
                    packageJson.dependencies[workspacePackage.name] = version;
                }
            }
        }
        if (packageJson.devDependencies) {
            for (const workspacePackage of workspacePackages) {
                if (packageJson.devDependencies[workspacePackage.name]) {
                    packageJson.devDependencies[workspacePackage.name] = version;
                }
            }
        }
        return packageJson;
    }

}
