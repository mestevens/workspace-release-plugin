import { Package } from "../models/Package";
import { injectable } from "inversify";

@injectable()
export class DependencyService {

    public updateVersions(packageJson: Package, workspacePackages: string[], version: string): Package {
        packageJson.version = version;
        if (packageJson.dependencies) {
            for (const workspacePackage of workspacePackages) {
                if (packageJson.dependencies[workspacePackage]) {
                    packageJson.dependencies[workspacePackage] = version;
                }
            }
        }
        return packageJson;
    }

}
