const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const serverPath = path.join(__dirname, 'server')
const publicfrontPath = path.join(__dirname, 'publicfront')
const privatefrontPath = path.join(__dirname, 'privatefront')

const distPath = path.join(__dirname, 'dist')

const indexPath = path.join(distPath, 'views', 'index.handlebars')
const publicIndexPath = path.join(distPath, 'public', 'index.html')

const panelPath = path.join(distPath, 'views', 'panel.handlebars')
const privateIndexPath = path.join(distPath, 'public', 'panel', 'index.html')

if (fs.existsSync(distPath)) fs.rmSync(distPath, { recursive: true, force: true })

fs.cpSync(serverPath, distPath, { recursive: true })

execSync(`npm run build`, { cwd: publicfrontPath }, (error, stdout, stderr) => {
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
if (fs.existsSync(indexPath)) fs.rmSync(indexPath)
fs.renameSync(publicIndexPath, indexPath)
execSync(`npm run build`, { cwd: privatefrontPath }, (error, stdout, stderr) => {
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
if (fs.existsSync(panelPath)) fs.rmSync(panelPath)
fs.renameSync(privateIndexPath, panelPath)