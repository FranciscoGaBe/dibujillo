const express = require('express')
const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const exphbs = require('express-handlebars')
const moment = require('moment')
const app = express()
const port = process.env.PORT
const server = process.env.HTTPS === 'true' ? (
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/dibujillo.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/dibujillo.com/fullchain.pem')
  }, app)
) : (
  http.createServer(app)
)
const expressWS = require('express-ws')(app, server)
const { dataPath, writeFile, readFile } = require('../utils/dataStorage')
const os = require('os-utils')
const fileUpload = require('express-fileupload')

app.use(fileUpload())

app.wss = expressWS.getWss()

// Views
app.set('views', path.join(__dirname, '..', 'views'))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Json
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use('/static', express.static(path.join(dataPath, 'static')))
app.use('/panel', express.static(path.join(__dirname, '..', 'panel')))

// Perfomance
function readPerfomance() {

  os.cpuUsage(v => {

    const data = readFile('r:perfomance')

    data.push([
      Number((v * 100).toFixed(2)),
      Number((os.freememPercentage() * 100).toFixed(2)),
      app.wss.rooms.length,
      moment(new Date()).format('YYYY-MM-DD HH:mm')
    ])

    writeFile('r:perfomance', data.slice(-3600 * 7))

  })

  setTimeout(readPerfomance, 60 * 1000)

}

// Token related
app.generateToken = () => {

  return Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)
    + Math.random().toString(36).slice(2, 9)

}

app.addAuthUser = (user, admin = false) => {

  let token = app.generateToken()

  while (app.authUsers.find(au => au.token === token)) { token = app.generateToken() }

  app.authUsers.push({
    token,
    created: moment(new Date()),
    user,
    admin
  })

  return token

}

app.getUser = token => app.authUsers.find(au => au.token === token)

app.authUsers = []

function clearAuth(rate) {

  app.authUsers.filter(au => moment(new Date()).diff(au.created, 'days') >= 30)
    .map((au, i) => i).forEach(i => app.authUsers.splice(i, 1))

  setTimeout(() => { clearAuth(rate) }, rate)

}

clearAuth(1000 * 60 * 60 * 24 * 7)

module.exports = {
  app,
  start: () => server.listen(port, () => logger.log(`Server started on port ${port}`))
}