const express = require('express'),
	router = express.Router()

router.post('/login', (req, res) => {

	if (req.ws && req.ws.user) return res.status(422).json({ error: 'Seems like you are already logged in' })

	if (!req.body.name) return res.status(422).json({ error: 'Name can\'t be empty' })

	res.json(req.ws.createUser({
		name: req.body.name,
		color: req.body.color,
		lang: req.body.lang
	}))

})

module.exports = router