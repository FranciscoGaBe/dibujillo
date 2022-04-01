const express = require('express'),
	router = express.Router(),
	storage = require('../../utils/dataStorage')

router.get('/', (req, res) => {

	let collections = req.wss.collections()

	if (req.isAdmin) return res.json(collections)

	return res.json(collections.map(c => ({ text: c.name, value: c.value })))

})

router.post('/', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

	if (!req.body.name || !req.body.value) return res.status(422).json({ error: 'Missing data' })

	const collections = req.wss.collections(),
		collection = collections.find(c => c.name === req.body.name || c.value === req.body.value)

	if (collection) return res.status(422).json({ error: 'There is an existing collection with that name' })

	storage.writeFile(`collections/${req.body.value}.json`, [])

	storage.writeFile(`collections.json`, [
		...collections,
		{
			name: req.body.name,
			value: req.body.value,
			dir: req.body.value,
			lang: req.body.lang || 'all'
		}
	])

	return res.json(req.wss.collections())

})

router.delete('/:id', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

	const collections = req.wss.collections(),
		index = collections.findIndex(c => c.value === req.params.id)

	if (index < 0) return res.status(404).json({ error: 'Collection not found' })

	collections.splice(index, 1)

	storage.writeFile('collections.json', collections)

	return res.json(req.wss.collections())

})

router.post('/arrange', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })
	if (
		req.body.newIndex === undefined ||
		req.body.oldIndex === undefined
	) return res.status(422).json({ error: 'Missing data' })

	const nI = Math.floor(Number(req.body.newIndex)),
		oI = Math.floor(Number(req.body.oldIndex))

	if (isNaN(nI) || isNaN(oI)) return res.status(422).json({ error: 'Indexes have to be numerical' })

	const collections = req.wss.collections()

	if (
		nI < 0 || nI > collections.length - 1 ||
		oI < 0 || oI > collections.length - 1
	) return res.status(422).json({ error: 'Indexes have to be contained in the array length' })

	collections.splice(req.body.newIndex, 0, collections.splice(req.body.oldIndex, 1)[0])

	storage.writeFile('collections.json', collections)

	return res.json(req.wss.collections())

})

router.get('/:id', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

	const collection = req.wss.collections().find(c => c.value === req.params.id)

	if (!collection) return res.status(404).json({ error: 'Collection not found' })

	return res.json({
		...collection,
		words: req.wss.collectionWords(req.params.id)
	})

})

router.post('/:id/word', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

	const collection = req.wss.collections().find(c => c.value === req.params.id)

	if (!collection) return res.status(404).json({ error: 'Collection not found' })
	if (!req.body.words) return res.status(422).json({ error: 'Words can\'t be empty' })

	const wordsCollection = req.wss.collectionWords(req.params.id),
		words = req.body.words.split(';').map(w => w.trim().toLowerCase()).filter(w => w !== '')

	words.forEach(w => {

		const words = w.split(':').filter(s => s.trim() !== '')

		if (!words[0]) return ''

		const cleanWords = [words[0]]

		words.forEach((word, i) => {

			if (i !== 0 && cleanWords.includes(word)) return

			cleanWords.push(word)

		})

		if (!wordsCollection.find(wC => wC[0] === words[0])) wordsCollection.push(cleanWords)

	})

	storage.writeFile(`collections/${collection.dir}.json`,
		wordsCollection.sort((a, b) => a[0].safe() > b[0].safe() ? 1 : -1)
	)

	return res.json({
		...collection,
		words: req.wss.collectionWords(req.params.id)
	})

})

router.delete('/:id/word', (req, res) => {

	if (!req.isAdmin) return res.status(403).json({ error: 'Unauthorized' })

	const collection = req.wss.collections().find(c => c.value === req.params.id)

	if (!collection) return res.status(404).json({ error: 'Collection not found' })
	if (!req.body.word) return res.status(422).json({ error: 'Word can\'t be empty' })

	const words = req.wss.collectionWords(req.params.id),
		index = words.findIndex(w => w[0] === req.body.word)

	if (index < 0) return res.status(404).json({ error: 'Word not found' })

	words.splice(index, 1)

	storage.writeFile(`collections/${collection.dir}.json`,
		Array.from(words)
			.map(w => w.map(wo => wo.toLowerCase()))
			.sort((a, b) => a[0].safe() > b[0].safe() ? 1 : -1)
	)

	return res.json({
		...collection,
		words: req.wss.collectionWords(req.params.id)
	})

})

module.exports = router