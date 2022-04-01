const express = require('express'),
  router = express.Router(),
  { app } = require('../../config/serverConfig'),
  users = (process.env.PANEL_USERS || '').split(';').map(user => {
    const [name, password, admin] = user.split(':')
    return { name, password, admin: admin === 'true' }
  })

router.post('/login', (req, res) => {

  if (!req.body.name || !req.body.password) return res.status(422).json({ error: 'All fields are required' })

  const user = users.find(u => u.name.toLowerCase() === req.body.name.toLowerCase())

  if (!user || user.password !== req.body.password) return res.status(422).json({ error: 'Invalid credentials' })

  return res.json({ name: user.name, token: app.addAuthUser(user.name, user.admin) })

})

module.exports = router