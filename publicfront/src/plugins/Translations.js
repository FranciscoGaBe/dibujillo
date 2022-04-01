const translations = {
	es: {
		update: {
			modalTitle: 'Es necesario actualizar la aplicación para jugar',
			modalAccept: 'Aceptar',
			modalCancel: 'Aceptar pero en rojo'
		},
		ads: {
			placeholder: 'Huequito pa los anuncios'
		},
		chat: {
			send: 'Enviar',
			error: 'El mensaje no ha podido ser enviado',
			sending: 'El mensaje esta siendo enviado'
		},
		history: {
			title: 'Historial',
			subtitle: 'mostrando ultimos 100 dibujos',
			download: 'Descargar'
		},
		createRoom: {
			showMore: 'Mostrar opciones avanzadas',
			showLess: 'Ocultar opciones avanzadas',
			create: 'Crear sala',
			collection: "Colección palabras",
			maxPlayers: "Jugadores maximos (8)",
			minStart: "Empezar con (2)",
			name: "Nombre",
			password: "Contraseña (Sala privada)",
			private: "Privada (Invitación)",
			roundTime: "Tiempo por turno (100)",
			rounds: "Numero de rondas (5)",
			shownWordPercentage: "% ultima pista (70%)",
			wordShowRounds: "Nº veces pista (5)",
			words: 'Listado de palabras, separadas por ";" (punto y coma) Max. 200 palabras. Si no son suficientes se repetiran.',
			custom: 'Personalizado',
			loadingCollections: 'Cargando colecciones'
		},
		error: {
			accept: 'aceptar'
		},
		game: {
			gameEnd: 'Fin de la partida',
			waiting: 'Esperando',
			waitingNextRound: 'Esperando al siguiente turno',
			waitingPlayers: 'Esperando jugadores',
			round: 'Ronda',
			selectWord: 'Escoge una palabra',
			choosingWord: 'Escogiendo palabra'
		},
		login: {
			welcome: 'Bienvenido',
			loadingRooms: 'Cargando salas disponibles',
			noRooms: 'Parece que no hay salas disponibles en este momento',
			joinRoom: 'Unirse',
			joinPublicRoom: 'Unirse a una sala',
			joinPrivateRoom: 'Unirse a una sala privada',
			createRoom: 'Crear una sala',
			connect: 'Conectar',
			userName: 'Nombre de usuario',
			code: 'Código',
			password: 'Contraseña'
		},
		options: {
			lang: 'Idioma',
			darkMode: 'Modo oscuro',
			color: 'Color',
			suggestions: 'Sugerencias',
			credits: 'Creditos',
			suggestionsTitle: 'Mandar sugerencia',
			suggestionsPlaceholder: 'Sugerencia',
			suggestionsAccept: 'Enviar',
			suggestionsCancel: 'Cancelar',
			volume: 'Volumen'
		},
		room: {
			code: 'Código',
			configShowMore: 'Mostrar configuración',
			configShowLess: 'Ocultar configuración',
			maxPlayers: 'Jugadores maximos',
			minStart: 'Empezar con',
			rounds: 'Nº rondas',
			roundTime: 'Tiempo de turno',
			shownWordPercentage: '% Palabra',
			wordShownRounds: 'Rondas palabra',
			private: 'Privada',
			collection: 'Colección'
		},
		user: {
			silenceUser: 'Silenciar usuario',
			votekick: 'Votar para expulsar',
			kick: 'Expulsar'
		}
	},
	en: {
		update: {
			modalTitle: 'An update is required to play the game',
			modalAccept: 'Accept',
			modalCancel: 'Accept but it\'s red'
		},
		ads: {
			placeholder: 'Advertisement placeholder'
		},
		chat: {
			send: 'Send',
			error: 'The message couldn\'t be sent',
			sending: 'The message has been sent'
		},
		history: {
			title: 'History',
			subtitle: 'showing last 100 drawings',
			download: 'Download'
		},
		createRoom: {
			showMore: 'Show advanced options',
			showLess: 'Hide advanced options',
			create: 'Create room',
			collection: "Words collection",
			maxPlayers: "Max. players (8)",
			minStart: "Game starts with (2)",
			name: "Name",
			password: "Password (Private room)",
			private: "Private (Invite only)",
			roundTime: "Time per turn (100)",
			rounds: "Number of rounds (5)",
			shownWordPercentage: "% last hint (50%)",
			wordShowRounds: "Number of hints (5)",
			words: 'List of words, divided by ";" (semicolon) Max. 200 words. If not enough they are going to repeat.',
			custom: 'Custom',
			loadingCollections: 'Loading collections'
		},
		error: {
			accept: 'accept'
		},
		game: {
			gameEnd: 'End of the game',
			waiting: 'Waiting',
			waitingNextRound: 'Waiting for next turn',
			waitingPlayers: 'Waiting for more players',
			round: 'Round',
			selectWord: 'Choose a word',
			choosingWord: 'Choosing a word'
		},
		login: {
			welcome: 'Welcome',
			loadingRooms: 'Loading available rooms',
			noRooms: 'Seems like there are no available rooms at this moment',
			joinRoom: 'Join',
			joinPublicRoom: 'Join public room',
			joinPrivateRoom: 'Join private room',
			createRoom: 'Create a room',
			connect: 'Connect',
			userName: 'Username',
			code: 'Code',
			password: 'Password'
		},
		options: {
			lang: 'Language',
			darkMode: 'Dark mode',
			color: 'Color',
			suggestions: 'Suggestions',
			credits: 'Credits',
			suggestionsTitle: 'Send suggestion',
			suggestionsPlaceholder: 'Suggestion',
			suggestionsAccept: 'Send',
			suggestionsCancel: 'Cancel',
			volume: 'Volume'
		},
		room: {
			code: 'Code',
			configShowMore: 'Show config',
			configShowLess: 'Hide config',
			maxPlayers: 'Max players',
			minStart: 'Starts with',
			rounds: 'Nº of rounds',
			roundTime: 'Time per turn',
			shownWordPercentage: 'Hint %',
			wordShownRounds: 'Nº hints',
			private: 'Private',
			collection: 'Collection'
		},
		user: {
			silenceUser: 'Silenciar usuario',
			votekick: 'Vote to kick',
			kick: 'Kick'
		}
	},
}

export default {

	install (Vue) {

		let lang = localStorage.getItem('lang'),
			_vm = null

		Vue.prototype.$availableLanguages = Object.keys(translations)

		if (!lang) lang = navigator.language.split('-')[0]

		if (!Vue.prototype.$availableLanguages.includes(lang)) lang = 'en'

		_vm = new Vue({
			data () {
				return {
					$lang: lang
				}
			}
		})

		Vue.mixin({
			computed: {

				$lang: {
					get () { return _vm.$data.$lang },
					set (val) {

						_vm.$data.$lang = val
						localStorage.setItem('lang', val)

					}
				}

			},
			beforeCreate () {

				this.$t = function (msg) {

					try {

						const str = msg.split('.').reduce((o, p) => o[p], translations[this.$lang])

						if (!str) throw ''

						return str

					}
					catch (err) {

						// eslint-disable-next-line
						console.log(`No translations for "${msg}" in language "${this.$lang}"`)

						return msg.split('.').reduce((o, p) => o[p], translations['es'])

					}

				}

			}
		})

	}

}
