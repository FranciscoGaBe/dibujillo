const express = require('express'),
	router = express.Router(),
	storage = require('../../utils/dataStorage')

router.get('/', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

	return res.json(storage.readFile('r:suggestions'))

})

router.delete('/', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })
	if (req.body.suggestion === undefined) return res.status(422).json({ error: 'Invalid data' })

	const suggestions = storage.readFile('r:suggestions'),
		index = suggestions.findIndex(s => s === req.body.suggestion)

	if (index < 0) return res.status(404).json({ error: 'Suggestion not found' })

	suggestions.splice(index, 1)

	storage.writeFile('r:suggestions', suggestions)

	return res.json(storage.readFile('r:suggestions'))

})

router.post('/', (req, res) => {

	const suggestion = req.body.suggestion

	if (!suggestion) return res.status(422).json({ error: 'Suggestion can\'t be empty' })

	const suggestions = storage.readFile('r:suggestions')

	if (!suggestions.includes(suggestion)) storage.writeFile('r:suggestions', [...suggestions, suggestion])

	return res.send('Suggestion send')

})

module.exports = router