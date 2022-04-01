const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const serverPath = path.join(__dirname, 'server')
const publicfrontPath = path.join(__dirname, 'publicfront')
const privatefrontPath = path.join(__dirname, 'privatefront')
const apps = [serverPath, publicfrontPath, privatefrontPath]

apps.forEach(pathToApp => {
  exec(`npm run serve`, { cwd: pathToApp }, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
})
