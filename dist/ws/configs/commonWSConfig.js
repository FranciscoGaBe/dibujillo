const LZUTF8 = require('lzutf8'),
	{ $t } = require('../../config/translations')

module.exports = {

	throttle: throttleMessages(10, 100),

	config: ws => {

		ws.$subtitute = (string) => string.replace(/{@(.*?)@}/g, (match, text) => $t(text, ws.user.lang))

		ws.on('message', data => {

			try {

				if (process.env.NODE_ENV === 'production') data = LZUTF8.decompress(data, {
					inputEncoding: 'StorageBinaryString'
				})

				const { event, msg } = JSON.parse(data)

				if (!event || ['message', 'connection', 'close', 'error'].includes(event)) return
				if (!ws.listenerCount(event)) return console.log(`Recibido evento desconocido: ${event}`)

				ws.emit(event, msg)

			}
			catch (err) {

				console.error(require('moment')(new Date()).format('YYYY-MM-DD HH:mm:ss'))

				console.error(err)

			}

		})

		ws.sendMsg = (event, msg, user) => {

			let data = ws.$subtitute(JSON.stringify({
				event,
				msg,
				user: user ? { id: user.id, name: user.name, color: user.color } : undefined
			}))

			if (process.env.NODE_ENV === 'production') data = LZUTF8.compress(data, {
				outputEncoding: 'StorageBinaryString'
			})

			ws.send(data)

		}

	}

}

function throttleMessages (rate, limit) {

	const clients = []

	function clearThrottle () {

		clients.forEach(c => c.messageCount = 0)

		setTimeout(clearThrottle, rate * 1000)

	}

	clearThrottle()

	return (ws) => {

		ws.messageCount = 0

		clients.push(ws)

		ws.on('newListener', (name, listener) => {

			if (name !== 'message' || listener.throttle) return

			function throttleListener (data) {

				if (ws.messageCount++ >= limit) return

				listener(data)

			}

			throttleListener.throttle = true

			ws.on('message', throttleListener)

			process.nextTick(() => ws.removeListener('message', listener))

		})

		ws.on('close', () => clients.splice(clients.indexOf(ws), 1))

	}

}