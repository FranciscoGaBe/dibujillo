const https = require('https'),
	WebSocket = require('ws'),
	{ $t, $availableLanguages } = require('../../config/translations'),
	{ config, throttle } = require('./commonWSConfig'),
	storage = require('../../utils/dataStorage')

module.exports = {

	wssConfig: (wss) => {

		wss.rooms = []
		wss.$t = $t
		wss.$availableLanguages = $availableLanguages

		wss.collections = () => storage.readFile('r:collections')

		wss.collectionWords = value => {

			const collection = wss.collections().find(c => c.value === value)

			if (!collection) return []

			return storage.readFile(`collections/${collection.dir}.json`).map(w => Array.isArray(w) ? w : [w, w])

		}

		wss.addRoom = function (config) {

			const Room = require('../classes/Room'),
				defaultConfig = {
					name: '',
					rounds: 5,
					roundTime: 60,
					wordShowRounds: 5,
					shownWordPercentage: 50,
					private: false,
					password: '',
					collection: 'basicES',
					customWords: [],
					maxPlayers: 8,
					minStart: 2,
					creator: null
				}

			let id = Math.random().toString(36).substr(2, 9),
				room = null

			while (this.rooms.find(r => r.id === id)) {

				id = Math.random().toString(36).substr(2, 9)

			}

			room = new Room(id, id, {
				...defaultConfig,
				...config,
				collectionName: wss.collections()
					.find(c => c.value === (config.collection || defaultConfig.collection)).name
			}, wss)

			this.rooms.push(room)

			return room

		}

		wss.broadcastRoom = function (event, room, msg, ws, user) {

			room.users.forEach(u => {

				if (!u.ws || u.ws === ws || (u.ws && u.ws.readyState !== WebSocket.OPEN)) return

				u.ws.sendMsg(event, msg, user ? user : (user ? user : undefined))

			})

		}

		wss.findUser = function (id) {

			return Array.from(wss.clients).find(c => c.user && c.user.id === id).user

		}

		return wss

	},

	wsConfig: (ws, wss) => {

		throttle(ws)

		config(ws)

		ws.broadcastRoom = function (event, msg, includeMySelf = false, user = null) {

			wss.broadcastRoom(event, this.room, msg, !includeMySelf ? this : null, user ? user : this.user)

		}

		ws.broadcast = function (event, msg, includeMySelf = false, user) {

			wss.clients.forEach((client) => {

				if (!includeMySelf && (client === this || client.readyState !== WebSocket.OPEN)) return

				client.sendMsg(event, msg, user ? user : (this.user ? this.user : undefined))

			})

		}

		ws.createUser = function (config) {

			const User = require('../classes/User')

			let id = Math.random().toString(36).substr(2, 9)

			while (Array.from(wss.clients).find(c => c.user && c.user.id === id)) {

				id = Math.random().toString(36).substr(2, 9)

			}

			if (config.lang && !$availableLanguages.includes(config.lang)) config.lang = 'en'

			ws.user = new User(id, ws, {
				color : 'c1',
				lang: 'en',
				...config
			})
			ws.room = null

			return {
				id: ws.user.id,
				name: ws.user.name,
				color: ws.user.color,
				lang: ws.user.lang
			}

		}

		ws.changeLang = function (lang) {

			if (!$availableLanguages.includes(lang)) lang = 'en'

			ws.user.lang = lang

			return lang

		}

	}

}