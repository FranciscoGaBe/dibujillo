const translations = {
	es: {
		main: {
			roomTitle: 'Dibujillo - ¡Unete a {@name@}!',
			roomDescription: '{@name@} - Palabras: {@collectionName@} - Dueño: {@owner@}',
			indexTitle: 'Dibujillo - ¡Demuestra quien es el mejor dibujando!',
			indexDescription: 'Juega con desconocidos o amigos y desmuestra quien es el mejor dibujando, un monton de palabras y opciones te esperan'
		},
		room: {
			roomFullError: 'La sala esta llena',
			startingGame: 'comenzando partida',
			userLeft: 'ha abandonado la partida',
			nextGame: 'siguiente partida',
			waitingPlayers: 'esperando jugadores',
			endingGame: 'Finalizando partida',
			nextTurn: 'Siguiente turno',
			userGuessedWord: 'ha acertado la palabra',
			userAlmostGuessedWord: 'ayss casi jajajaja',
			userWelcome: 'Bienvenid@ a',
			userJoined: 'se ha conectado',
			userReported: 'ha reportado al dibujante',
			userKicked: 'ha sido expulsado',
			custom: 'Personalizado',
			kicked: 'Has sido expulsado de la sala',
			newCreator: 'es el dueño de la sala'
		},
		joinRoom: {
			wrongData: 'Datos incorrectos',
			noExists: 'La sala especificada no existe'
		}
	},
	en: {
		main: {
			roomTitle: 'Dibujillo - ¡Join {@name@}!',
			roomDescription: '{@name@} - Words: {@collectionName@} - Owner: {@owner@}',
			indexTitle: 'Dibujillo - Show them who is the best at drawing!',
			indexDescription: 'Play with strangers or your friends to prove who is the best at drawing, lots of words and options awaits you'
		},
		room: {
			roomFullError: 'The room is full',
			startingGame: 'starting game',
			userLeft: 'left the game',
			nextGame: 'next game',
			waitingPlayers: 'waiting for players',
			endingGame: 'Ending game',
			nextTurn: 'Next turn',
			userGuessedWord: 'guessed the word',
			userAlmostGuessedWord: 'so close yet so far',
			userWelcome: 'Welcome to',
			userJoined: 'joined the room',
			userReported: 'has reported the drawer',
			userKicked: 'has been kicked',
			custom: 'Custom',
			kicked: 'You have been kicked from the room',
			newCreator: 'is the room owner'
		},
		joinRoom: {
			wrongData: 'Wrong data',
			noExists: 'The specified room doesn\'t exists'
		}
	},
}

module.exports = {

	$availableLanguages: Object.keys(translations),

	$t: (msg, lang) => {

		const str = msg.split('.').reduce((o, p) => o[p], translations[lang])

		if (!str) throw ''

		return str
		//
		// try {
		//
		//
		//
		// }
		// catch (err) {
		//
		// 	return msg.split('.').reduce((o, p) => o[p], translations['es'])
		//
		// }

	}

}
