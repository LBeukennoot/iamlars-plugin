# New version
Update the version in `package.json` and `iamlars-plugin.php`. Commit the changes. In Github, create a new release with a new tag. This will automatically update the update in Wordpress environments

# Development environment
Create a local Wordpress website using Docker (or another php server). Place this project in /wp-content/plugins, run `yarn` or `npm i` to install all packages. Run `yarn dev` to start the environment.