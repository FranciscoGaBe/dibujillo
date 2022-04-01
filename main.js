#!/usr/bin/node
require('dotenv').config()
Error.stackTraceLimit = 20
const moment = require('moment')

require('./utils/prototypeExtender')

global.logger = {
  log: console.log,
  error: console.error
}

try {

  const { app, start } = require('./config/serverConfig')
  const wss = app.wss


  require('./ws/configs/wsConfig').wssConfig(wss)

  app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')

    if (req.method === 'OPTIONS') return res.send()

    next()

  })

  app.ws('/ws', ws => {

    try {

      require('./ws/configs/wsConfig').wsConfig(ws, wss)

      let token = app.generateToken()

      while (Array.from(wss.clients).find(c => c.accessToken === token)) {

        token = app.generateToken()

      }

      ws.accessToken = token

      ws.sendMsg('accessToken', token)

      ws.on('close', () => {

        if (!ws.room) return

        ws.room.removeUser(ws.user)

        ws.user.delete()

      })

    }
    catch (err) { logger.error(err) }

  })

  app.get('/', (req, res) => {

    const lang = getLanguage(req)

    res.render('index', {
      title: wss.$t('main.indexTitle', lang),
      description: wss.$t('main.indexDescription', lang)
    })

  })

  app.get('/index.html', (req, res) => {

    const lang = getLanguage(req)

    res.render('index', {
      title: wss.$t('main.indexTitle', lang),
      description: wss.$t('main.indexDescription', lang)
    })

  })

  app.get('/panel', (req, res) => {

    res.render('panel')

  })

  app.get('/r/:id', (req, res) => {

    const room = wss.rooms.find(r => r.code === req.params.id),
      lang = getLanguage(req)

    if (!room) return res.redirect('/')

    room.owner = room.creator.name

    res.render('index', {
      title: wss.$t('main.roomTitle', lang).replace(/{@(.*?)@}/g, (match, text) => room[text]),
      description: wss.$t('main.roomDescription', lang).replace(/{@(.*?)@}/g, (match, text) => room[text]),
      room: room
    })

  })

  app.use((req, res, next) => {

    const auth = req.headers.authorization

    if (auth) {

      const [type, token] = auth.split(' ')

      if (type === 'ws') {

        const ws = Array.from(wss.clients).find(c => c.accessToken === token)

        if (!ws) return res.status(401).json({ error: 'Unauthorized' })

        req.ws = ws

      }
      else if (type === 'Bearer') {

        const au = app.getUser(token)

        if (!au) return res.status(401).json({ error: 'Unauthorized' })

        req.user = {
          admin: au.admin
        }

      }

    }

    req.checkRoomPermission = id => {

      const room = wss.rooms.find(r => r.id === id)

      if (!room) return null

      if (req.ws) return room === req.ws.room ? room : null

      if (req.isAdmin) return room

      return null

    }

    req.wss = app.wss
    req.isAdmin = req.user && req.user.admin

    next()

  })

  require('./routes/api/main').forEach(r => {

    app.use(`/api${r.route}`, r.router)

  })

  start()

}
catch (err) { logger.error(err) }

function getLanguage(req) {

  const { $availableLanguages } = require('./config/translations'),
    lang = req.headers["accept-language"] ? req.headers["accept-language"].slice(0, 2) : 'en'

  if (!$availableLanguages.includes(lang)) return 'en'

  return lang

}