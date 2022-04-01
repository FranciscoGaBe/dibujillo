const express = require('express'),
	router = express.Router()

router.post('/:room/draw', (req, res) => {

	const room = req.checkRoomPermission(req.params.room),
		ws = req.ws

	if (!room) return res.status(404).json({ error: 'Room not found' })

	if (!ws.user.active) return res.status(403).json({ error: 'It\'s not your turn' })

	if (!Array.isArray(req.body.data) || !req.body.data.length) return res.status(422).json({ error: 'Invalid data' })

	if (req.body.data.some(d => isNaN(d[0])
		|| isNaN(d[1]) || isNaN(d[3]))) return res.status(422).json({ error: 'Invalid data ???' })

	room.currentDrawing = [...room.currentDrawing, ...req.body.data]
	ws.broadcastRoom('draw', req.body.data, false)

	return res.json({ message: 'Data sent' })

})

router.post('/:room/emote', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })

	if (!req.body.emote) return res.status(422).json({ error: 'No emote especified' })

	room.broadcast('emote', req.body.emote, { id: req.ws.user.id })

	return res.json({ message: 'Emote send' })

})

router.get('/:room/deleteDrawing', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })

	room.deleteDrawing(req.query.color || 'white')

	return res.json({ message: 'Drawing deleted' })

})

router.get('/:room/reportactiveplayer', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })
	if (!room.activeUser) return res.status(422).json({ error: 'No one to report' })
	if (room.activeReport.includes(req.ws.user.id)) return res.status(422).json({ error: 'Already reported' })
	if (req.ws.user.waiting) return res.status(422).json({ error: 'You can\'t report while waiting' })

	const activePlayers = room.users.filter(u => u !== room.activeUser && !u.waiting)

	room.activeReport.push(req.ws.user.id)

	const reports = activePlayers.map(u => u.id).filter(id => room.activeReport.includes(id)).length

	room.broadcast(
		'chat',
		`${req.ws.user.name} {@room.userReported@} (${room.activeReport.length}/${activePlayers.length})`
	)

	if (reports >= activePlayers.length) room.currentRoundTime = 0

	return res.json({ message: 'Player reported' })

})

router.get('/:room/votekick/:id', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })

	const user = room.users.find(u => u.id === req.params.id)

	if (!user) return res.status(404).json({ error: 'User not found' })
	if (user === room.creator) return res.status(403).json({ error: 'Bruh, thats the owner' })

	if (!room.voteKick[user.id]) room.voteKick[user.id] = []
	if (room.voteKick[user.id].includes(req.ws.user.id)) return res.status(422).json({ error: 'Already voted' })

	room.voteKick[user.id].push(req.ws.user.id)

	if (!room.users.filter(u => u !== user).map(u => u.id).some(id => !room.voteKick[user.id].includes(id))) {

		user.ws.sendMsg('errorMsg', '{@room.kicked@}')
		user.ws.sendMsg('leaveRoom')
		room.removeUser(user)

	}

	return res.json({ message: 'Vote received' })

})

router.get('/:room/kick/:id', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })
	if (!req.isAdmin && (!req.ws || room.creator !== req.ws.user))
		return res.status(403).json({ error: 'You are not the owner of the room' })

	const user = room.users.find(u => u.id === req.params.id)

	if (!user) return res.status(404).json({ error: 'User not found' })

	user.ws.sendMsg('errorMsg', '{@room.kicked@}')
	user.ws.sendMsg('leaveRoom')
	room.removeUser(user)

	return res.json({ message: 'User kicked' })

})

router.get('/:room/leaveRoom', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })

	room.removeUser(req.ws.user)

	req.ws.sendMsg('leaveRoom')

	return res.json({ message: 'Left the room' })

})

router.post('/:room/message', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })
	if (!req.body.msg) return res.status(422).json({ error: 'Message cant be empty' })

	return res.json(room.checkWord(req.body.msg, req.user || req.ws.user))

})

router.get('/:room/history', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })

	return res.json(room.getHistory(req.query.historyLength || 0))

})

router.get('/:room/start', (req, res) => {

	const room = req.checkRoomPermission(req.params.room)
	if (!room) return res.status(404).json({ error: 'Room not found' })

	room.start()

	return res.send('Event received')

})

module.exports = router