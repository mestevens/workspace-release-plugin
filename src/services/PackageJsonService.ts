import { glob } from "glob";
import { Package } from "../models/Package";
import { injectable } from "inversify";

@injectable()
export class PackageJsonService {

    public findPackageJson(workspace: string): string[] {
        // TODO fix to work properly
        return glob.sync(`${process.cwd()}/test-repo/${workspace}/package.json`, {
            ignore: '**/node_modules/**/package.json'
        });
    }

    public findPackageName(packageJson: string): string {
        const json: Package = this.getPackageJson(packageJson);
        return json.name;
    }

    public getPackageJson(packageJson: string): Package {
        return require(packageJson);
    }

}
