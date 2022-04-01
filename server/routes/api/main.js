module.exports = [
	{ route: '/game', router: require('./game') },
	{ route: '/room', router: require('./room') },
	{ route: '/collection', router: require('./collection') },
	{ route: '/suggestion', router: require('./suggestion') },
	{ route: '/ws', router: require('./ws') },
	{ route: '/user', router: require('./user') },
	{ route: '/easteregg', router: require('./easteregg') },
	{ route: '/auth', router: require('./auth') },
	{ route: '/admin', router: require('./admin') },
]