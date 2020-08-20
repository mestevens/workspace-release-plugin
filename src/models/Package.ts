export interface Package {
    name: string;
    version: string;
    workspaces?: string[];
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    files?: string[];
    packagePath: string;
}
