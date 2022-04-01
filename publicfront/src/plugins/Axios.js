import axios from 'axios'
import Vue from 'vue'

const _vm = new Vue({
	data () {
		return {
			auth: ''
		}
	}
})

const routes = {
	ws: prepareResource('/ws', [{ name: 'login', path: '/login', method: 'POST' }]),
	game: prepareResource('/game/:room', [
		{ name: 'message', path: '/message', children: [ { name: 'store', method: 'POST', path: '' } ] },
		{ name: 'history', path: '/history', children: [ { name: 'index', method: 'GET', path: '' } ] },
		{ name: 'start', path: '/start', method: 'GET' },
		{ name: 'emote', path: '/emote', method: 'POST' },
		{ name: 'votekick', path: '/votekick/:user', method: 'GET' },
		{ name: 'kick', path: '/kick/:user', method: 'GET' },
		{ name: 'leaveroom', path: '/leaveroom', method: 'GET' },
		{ name: 'reportactiveplayer', path: '/reportactiveplayer', method: 'GET' },
		{ name: 'deletedrawing', path: '/deletedrawing', method: 'GET' },
		{ name: 'draw', path: '/draw', method: 'POST' },
	]),
	collection: prepareResource('/collection', [
		{ name: 'index', path: '/', method: 'GET' }
	]),
	suggestion: prepareResource('/suggestion', [
		{ name: 'store', path: '/', method: 'POST' }
	]),
	room: prepareResource('/room', [
		{ name: 'index', path: '/', method: 'GET' },
		{ name: 'join', path: '/join', method: 'POST' },
		{ name: 'joinInv', path: '/joininv', method: 'POST' },
		{ name: 'store', path: '/', method: 'POST' },
	]),
	user: prepareResource('/user', [
		{ name: 'lang', path: '/:user/lang', method: 'POST' },
		{ name: 'color', path: '/:user/color', method: 'POST' }
	]),
	easteregg: prepareResource('/easteregg', [
		{ name: 'index', path: '/', method: 'GET' }
	])
}

function prepareResource (path, routes) {

	function getRoutes (path, route) {

		path = `${path}${route.path}`

		if (route.children) {

			return route.children.reduce((o, r) => {

				o[r.name] = getRoutes(path, r)

				return o

			}, {})

		}
		else {

			return (data, options) => {

				const config = {
					method: route.method,
					...options
				}

				if (route.method.toLowerCase() === 'get') config.params = data
				else config.data = data

				return prepareRoute(path, config)

			}

		}

	}

	return routes.reduce((o, r) => {

		o[r.name] = getRoutes(path, r)

		return o

	}, {})

}

function prepareRoute (url, options = {}) {

	const conf = {
		method: 'GET',
		headers: { 'Authorization': _vm.auth },
		routeParams: {},
		...options
	}

	url = url.replace(/:(\w*)/g, (match, text) => conf.routeParams[text])

	return axios(`${process.env.VUE_APP_API_URL}${url}`, conf)

}

export default {

	install (Vue) {

		Vue.mixin({
			beforeCreate () {

				this.$setAuth = (auth) => _vm.auth = auth
				this.$api = routes

			}
		})

	}


}

