# workspace-release-plugin

This is a plugin to help deal with versioning and packaging yarn workspaces.

## The problem

### Versioning 
When working with a yarn workspace, I want to be able to release everything at the same time. This often causes problems if there are multiple projects that depend on each other since you need to order the releases. There are tools out there already to deal with this, but they require extra configuration like [Lerna](https://lerna.js.org/). The point of this plugin is to provide something lightweight that will use an existing configuration

### Packaging
In addition, it's difficult to package up a project that isn't a library and release it with workspace dependencies. Again, you need to make sure everything is released in the correct order and then re-install dependencies external to the workspace (or yarn will just link the packages in the workspace). This plugin provides a command that packages a specified project into a `zip` file, including the workspace packages.

## Installation

It's recommended to install this plugin globally so that you don't have to worry about including it on a per-project basis. This can be done with `yarn global add @mestevens/workspace-release-plugin`

## Commands

### `version`

This command simply goes through all the package.json files of the workspace and replaces the version of that package and any workspace dependencies with the specified version.

Arguments

flags | description | required | default
--- | --- | --- | ---
-w, --w, -workspace, --workspace | The package.json file that contains the workspace information. | `false` | `./package.json`
-v, --v, -version --version | The version to set everything to | `true` |

### `zip`

This command will take the package named `packageName` in the workspace, copy it, and all dependencies (including workspace dependencies) that are installed and create a `zip` file for you to use.

Arguments

flags | description | required | default
--- | --- | --- | ---
-w, --w, -workspace, --workspace | The package.json file that contains the workspace information. | `false` | `./package.json`
-p, --p, -packageName --packageName | The package to zip | `true` |
-t, --t, -temp --temp | The temporary folder to use to zip the package. This folder will be deleted after the plugin is done running. | `false` | `./dist`