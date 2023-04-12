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

function updatePackages(packageJson, pattern, version) {
  const dependencies = packageJson.dependencies

  for (let packageName in dependencies) {
    if (packageName.startsWith(pattern)) {
      dependencies[packageName] = version
    }
  }

  return packageJson
}

function setPackagesVersion(pattern, version) {
  const filePath = path.resolve(__dirname, 'package.json')
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const packageJson = JSON.parse(data)
    updatePackages(packageJson, pattern, '5.0.0')
    fs.writeFile(filePath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err)
        return
      }
      deleteLockFiles()
      console.log(`Chroma Bit Packages updated to v${version}`)
      installDependencies()
    })
  })
}

setPackagesVersion('@iag/chroma-react-ui', '5.0.0')
