const express = require('express'),
  router = express.Router(),
  storage = require('../../utils/dataStorage')

router.use((req, res, next) => {

  if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

  next()

})


router.post('/message', (req, res) => {

  if (!req.body.msg) return res.status(422).json({ error: 'Invalid data' })

  Array.from(req.wss.clients).forEach(c => {

    c.sendMsg('adminMsg', req.body.msg)

  })

  return res.send('Message sent')

})

router.get('/perfomance', (req, res) => {

  const data = storage.readFile('r:perfomance')

  return res.json(data.filter(d => d[3].slice(0, 10) === req.query.date))

})

module.exports = router