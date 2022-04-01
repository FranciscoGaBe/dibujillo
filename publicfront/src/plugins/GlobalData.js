export default {

	install (Vue) {

		let _vm = new Vue({
			data () {
				return {
					$color: localStorage.getItem('iColor') || 'c1',
					$mode: localStorage.getItem('iMode') || 'dark',
					$globalModal: null,
					$ws: null,
					$user: null,
					$room: null,
					$users: [],
					$volume: Number(localStorage.getItem('volume')) || .5,
					$easterEggs: []
				}
			}
		})

		Vue.mixin({
			computed: {

				$easterEggs: {
					get () { return _vm.$data.$easterEggs },
					set (val) { _vm.$data.$easterEggs = val }
				},

				$user: {
					get () { return _vm.$data.$user },
					set (val) { _vm.$data.$user = val }
				},

				$volume: {
					get () { return _vm.$data.$volume },
					set (val) {

						_vm.$data.$volume = val
						localStorage.setItem('volume', val.toString())

					}
				},

				$room: {
					get () { return _vm.$data.$room },
					set (val) { _vm.$data.$room = val }
				},

				$users: {
					get () { return _vm.$data.$users },
					set (val) { _vm.$data.$users = val }
				},

				$color: {
					get () { return _vm.$data.$color },
					set (val) {

						_vm.$data.$color = val
						localStorage.setItem('iColor', val)

					}
				},

				$mode: {
					get () { return _vm.$data.$mode },
					set (val) {

						_vm.$data.$mode = val
						localStorage.setItem('iMode', val)

					}
				},

				$globalModal: {
					get () { return _vm.$data.$globalModal },
					set (val) { _vm.$data.$globalModal = val }
				},

				$ws: {
					get () { return _vm.$data.$ws },
					set (val) { _vm.$data.$ws = val }
				},

			},
			methods: {

				$modal (options) {

					if (!_vm.$data.$globalModal) return

					_vm.$data.$globalModal.open(options)

				},

				$handleEvents () { handleEvents(this, _vm.$data.$ws) }

			},
			beforeMount () { handleEvents(this, _vm.$data.$ws) }
		})

	}

}

function handleEvents (vm, ws) {
	
	if (vm && vm.wsEvents && ws) {

		const fs = vm.wsEvents.map(e => (ev) => vm[`on${e.capitalize()}`](ev.detail.msg, ev.detail.user))

		fs.forEach((f, i) => ws.addEventListener(vm.wsEvents[i], f))

		vm.$once('hook:beforeDestroy', () => {

			fs.forEach((f, i) => ws.removeEventListener(vm.wsEvents[i], f))

		})

	}

}