const express = require('express'),
  router = express.Router(),
  storage = require('../../utils/dataStorage')

router.get('/', (req, res) => {

  const easterEggs = storage.readFile('r:easterEggs').map(easterEgg => ({
    ...easterEgg,
    path: process.env.BASE_URL + easterEgg.path
  }))
  return res.send(easterEggs)

})

router.post('/', async (req, res) => {

  if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })
  if (!req.body.text || !req.files.file) return res.status(422).json({ error: 'Invalid data' })

  const easterEggs = storage.readFile('r:easterEggs')

  if (easterEggs.find(e => e.text === req.body.text))
    return res.status(422).json({ error: 'Already exists' })

  easterEggs.push({
    text: req.body.text,
    path: '/static/eastereggs/' + req.files.file.name
  })

  storage.exists('/static/eastereggs/')

  await req.files.file.mv(storage.dataPath + 'static/eastereggs/' + req.files.file.name)

  storage.writeFile('r:easterEggs', easterEggs)

  return res.send(storage.readFile('r:easterEggs'))

})

router.delete('/', async (req, res) => {

  if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })
  if (!req.body.text) return res.status(422).json({ error: 'Invalid data' })

  const easterEggs = storage.readFile('r:easterEggs'),
    index = easterEggs.findIndex(e => e.text === req.body.text)

  if (index < 0) return res.status(404).json({ error: 'Resource not found' })

  easterEggs.splice(index, 1)

  storage.writeFile('r:easterEggs', easterEggs)

  return res.send(storage.readFile('r:easterEggs'))

})


module.exports = router