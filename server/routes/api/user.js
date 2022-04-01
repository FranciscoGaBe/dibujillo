const express = require('express'),
	router = express.Router()

router.post('/:user/color', (req, res) => {

	const user = req.wss.findUser(req.params.user)

	if (!user) return res.status(404).json({ error: 'User not found' })
	if (!req.body.color) return res.status(422).json({ error: 'No color especified' })
	if (!req.isAdmin && (!req.ws || req.ws.user !== user)) return res.status(403).json({ error: 'You can\'t do that' })

	user.color = req.body.color

	if (req.ws.room) req.ws.room.updateUsers()

	return res.send(req.body.color)

})

router.post('/:user/lang', (req, res) => {

	const user = req.wss.findUser(req.params.user)

	if (!user) return res.status(404).json({ error: 'User not found' })
	if (!req.body.lang) return res.status(422).json({ error: 'No language especified' })
	if (!req.isAdmin && (!req.ws || req.ws.user !== user)) return res.status(403).json({ error: 'You can\'t do that' })

	const lang = req.ws.changeLang(req.body.lang)

	return res.send(lang)

})

module.exports = router