# setPackagesVersion

Set packages to a set version in packages.json based on a string pattern

Possible function for a CLI tool where a particular set of components need to be updated to a specific version

## Usage

`setPackagesVersion('@freaksauce/react-ui', '2.0.0')`

The following components would be updated:

```
"@freaksauce/react-ui.button": "1.2.3",
"@freaksauce/react-ui.checkbox": "1.1.0",
```

to:

```
"@freaksauce/react-ui.button": "2.0.0",
"@freaksauce/react-ui.checkbox": "2.0.0",
```

Once the `package.json` has been updated the lock files are deleted if they exist.
