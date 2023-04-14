const fs = require('fs')
const path = require('path')
const { spawn } = require('node:child_process')

function installDependencies() {
  const child = spawn('npm', ['install'], { stdio: 'inherit' })
  child.on('exit', (code, signal) => {
    console.log(`npm install exited with code ${code} and signal ${signal}`)
  })
}

function deleteLockFiles() {
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json')
    console.log('package-lock.json deleted')
  }

  if (fs.existsSync('yarn-lock.json')) {
    fs.unlinkSync('yarn-lock.json')
    console.log('yarn-lock.json deleted')
  }
}

function deleteDirectory(directory) {
  fs.rm(directory, { recursive: true }, () => console.log(`${directory} deleted`))
}

function updatePackages(packageJson, pattern, version, modifier) {
  const dependencies = packageJson.dependencies

  for (const packageName in dependencies) {
    if (packageName.startsWith(pattern)) {
      dependencies[packageName] = modifier + version
    }
  }

  return packageJson
}

function getPkgDir(str) {
  const index = str.indexOf('/')
  return index === -1 ? str : str.substring(0, index)
}

function updateFile(tagName, version, filePath, tagRegex) {
  let contents = fs.readFileSync(filePath, 'utf8')
  contents = contents.replace(tagRegex, `<${tagName} version="${version}"`)
  fs.writeFileSync(filePath, contents, 'utf8')
}

function updateBrandProviderVersion(version, BrandProviderSearchPath = './src') {
  const tagName = 'BrandProvider'
  const tagRegex = new RegExp(`<${tagName}.*?version="(.*?)"`, 'g')
  if (fs.statSync(BrandProviderSearchPath).isFile()) {
    updateFile(tagName, version, BrandProviderSearchPath, tagRegex)
  } else {
    fs.readdirSync(BrandProviderSearchPath).forEach((file) => {
      const filePath = path.join(BrandProviderSearchPath, file)
      if (fs.statSync(filePath).isDirectory()) {
        updateBrandProviderVersion(tagName, version, filePath) // recursively search subdirectories
      } else {
        updateFile(tagName, version, filePath, tagRegex)
      }
    })
  }
}

function setPackagesVersion(pattern, version, modifier = null, BrandProviderSearchPath) {
  const dir = getPkgDir(pattern)
  const filePath = path.resolve(__dirname, 'package.json')
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const packageJson = JSON.parse(data)
    updatePackages(packageJson, pattern, version, modifier)
    fs.writeFile(filePath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err)
        return
      }
      console.log(`Chroma Bit Packages updated to v${version}`)
      deleteLockFiles()
      console.log(`Lock files deleted`)
      deleteDirectory(`./node_modules/${dir}`)
      console.log(`${dir} dir deleted`)
      installDependencies()
      console.log(`dependencies installing...`)
      updateBrandProviderVersion(version, BrandProviderSearchPath)
      console.log('BrandProvider version updated')
    })
  })
}

setPackagesVersion('@iag/chroma-react-ui', '1.0.1', '^', './src/App.js')
