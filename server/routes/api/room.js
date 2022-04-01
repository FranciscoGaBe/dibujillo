const express = require('express'),
	router = express.Router()

router.get('/', (req, res) => {

	let page = parseInt(req.query.page || 1)

	if (isNaN(page)) page = 1

	let rooms = req.wss.rooms.slice((page - 1) * 100, page * 100)

	if (req.isAdmin) return res.json(rooms.map(r => ({
		id: r.id,
		name: r.name,
		users: r.users.map(u => ({ id: u.id, name: u.name, color: u.color })),
		maxPlayers: r.maxPlayers,
		minStart: r.minStart,
		private: r.private,
		state: r.state,
		creator: {
			id: r.creator.id,
			name: r.creator.name
		},
		collectionName: r.collectionName,
		round: r.round,
		rounds: r.rounds,
		word: r.word
	})))

	return res.json(rooms.filter(r => !r.private).map(r => ({
		id: r.id,
		name: r.name,
		users: r.users.length,
		maxPlayers: r.maxPlayers,
		private: r.private,
		creator: {
			id: r.creator.id,
			name: r.creator.name
		},
		collectionName: r.collectionName
	})))

})

router.post('/', (req, res) => {

	if (!req.ws) return res.json({ message: 'All gucci, you can create a room' })

	req.body.creator = req.ws.user

	req.wss.addRoom(validateRoomData(req.body, req.wss)).addUser(req.ws.user)

	return res.json({ message: 'Room created' })

})

router.post('/join', (req, res) => {

	const room = req.wss.rooms.find(r => r.id === req.body.id)

	if (!room) return res.status(422).json({ error: 'Room not found' })
	if (room.private && room.password !== '' &&
		!req.body.password) return res.status(422).json({ error: 'Incorrect password' })
	if (room.users.length >= room.maxPlayers) return res.status(409).json({ error: 'The room is full' })
	if (!req.ws) return res.json({ message: 'Can join the room' })

	joinRoom(room, req)

	return res.json({ message: 'Joined room' })

})

router.post('/joininv', (req, res) => {

	const room = req.wss.rooms.find(r => r.code === req.body.code)

	if (!room) return res.status(422).json({ error: 'Room not found' })
	if (room.users.length >= room.maxPlayers) return res.status(409).json({ error: 'The room is full' })
	if (!req.ws) return res.json({ message: 'Can join the room' })

	joinRoom(room, req)

	return res.json({ message: 'Joined room' })

})

function joinRoom (room, req) {

	req.wss.rooms.forEach(r => r.removeUser(req.ws.user))

	room.addUser(req.ws.user)

}

function validateRoomData (data, wss) {

	const numericProps = [
		{ name: 'rounds', min: 1, max: 10, def: 5 },
		{ name: 'minStart', min: 1, max: 20, def: 2 },
		{ name: 'maxPlayers', min: 1, max: 20, def: 8 },
		{ name: 'roundTime', min: 10, max: 200, def: 100 },
		{ name: 'wordShowRounds', min: 0, max: 10, def: 5 },
		{ name: 'shownWordPercentage', min: 0, max: 100, def: 50 },
	]

	if (!data.name) data.name = 'Sin nombre'

	numericProps.forEach(p => { data[p.name] = truncateProp(data[p.name], p.min, p.max, p.def) })

	if (data.password) data.private = true

	if (data.collection === 'custom' && data.words.split(';').map(w => w.trim()).filter(w => w !== '').length > 0) {

		const customWords = data.words.split(';').map(w => w.trim()).filter(w => w !== '')

		data.customWords = []

		while (data.customWords.length < 400) {

			data.customWords = [
				...data.customWords,
				...customWords.map(w => {

					const words = w.split(':').filter(s => s.trim() !== '')

					if (!words[0]) return ''

					const cleanWords = [words[0]]

					words.forEach((word, i) => {

						if (i !== 0 && cleanWords.includes(word)) return

						cleanWords.push(word)

					})

					return cleanWords

				}).filter(w => w !== '')
			]

		}

		if (data.customWords.length > 2000) data.customWords.length = 2000

	}
	else if (!wss.collections().find(c => c.value === data.collection)) data.collection = 'basicEN'

	return data

}

function truncateProp (prop, min, max, def) {

	let out = Number(prop)

	if (prop === '' || isNaN(out)) out = def
	else if (out < min) out = min
	else if (out > max) out = max

	return Math.floor(out)

}

module.exports = router

