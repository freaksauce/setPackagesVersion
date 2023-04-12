# setPackagesVersion

Set packages to a set version in packages.json based on a string pattern

Possible function for a CLI tool where a particular set of components need to be updated to a specific version

## Usage

`setPackagesVersion('@iag/chroma-react-ui', '1.0.1')`

The following components would be updated:

```
"@freaksauce/react-ui.button": "1.0.0",
"@freaksauce/react-ui.checkbox": "1.0.0",
```

to:

```
"@freaksauce/react-ui.button": "1.0.1",
"@freaksauce/react-ui.checkbox": "1.0.1",
```

Once the `package.json` has been updated the lock files are deleted if they exist.
Next the `node_modules` dir is deleted (in the example above that would be `@freaksauce`) before `npm install` is run as the final part of the process.
