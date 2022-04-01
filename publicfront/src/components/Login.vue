<template>
	<form
		ref="form"
		id="login"
		class="flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out"
		@submit.prevent="connect"
	>

		<div class="rounded p-4" :class="[`bg-dark-3 text-dark-text`]">

			<img class="h-20 mb-4 mx-auto rounded-lg" src="/img/Logo.png" alt="Dibujillo">

			<template v-if="!room">

				<login-username v-if="$user === null"/>

				<login-room
					v-else
					@join="onJoin"
					@create="onCreate"
				/>

			</template>

			<login-invited-room v-else :room="room" @join="onJoin"/>

		</div>

		<options size="4xl" class="fixed top-0 right-0 m-10"/>

	</form>
</template>

<script>
	import webSocket from '../utils/websocket'
	import LoginUsername from './LoginUsername'
	import LoginRoom from './LoginRoom'
	import LoginInvitedRoom from './LoginInvitedRoom'
	import Options from './Options'

	export default {
		name: 'Login',
		components: { LoginUsername, LoginRoom, Options, LoginInvitedRoom },
		data () {
			return {
				wsEvents: ['joinRoom', 'accessToken'],
				room: null,
				connecting: false,
				callback: null
			}
		},
		created () {

			const dibujilloTags = Array.from(document.querySelectorAll('meta[name^="dibujillo:room_"]'))

			if (!dibujilloTags.length) return

			this.room = dibujilloTags.reduce((o, t) => {

				o[t.name.split(':')[1].slice(5)] = t.content

				return o

			}, {})

		},
		methods: {

			onJoinRoom (data) {

				const url = new URL(location.href)

				window.history.pushState({ path: url.origin }, '', url.origin)

				this.$emit('room', data)

			},

			async onJoin (room) {

				if (this.connecting) return

				this.connecting = true

				try {

					if (!this.room) await this.$api.room.join(room)
					else await this.$api.room.joinInv(this.room)

					if (!this.$ws) {

						this.startWS()

						this.callback = () => { this.joinRoom(room) }

					}

					this.connecting = false

				}
				catch (err) {

					this.connecting = false
					this.$modal.open({
						title: 'Error',
						body: err.response.message
					})

				}

			},

			onCreate (data) {

				if (this.connecting) return

				this.connecting = true

				try {

					if (!this.$ws) {

						this.startWS()

						this.callback = () => { this.$api.room.store(data) }

					}

					this.$api.room.store(data)

					this.connecting = false

				}
				catch (err) {

					this.connecting = false
					this.$modal.open({
						title: 'Error',
						body: err.response.message 
					})

				}

			},

			async onAccessToken (token) {

				this.$setAuth(`ws ${token}`)

				await this.login()

				if (this.callback) this.callback()

				this.callback = null

			},

			startWS () {

				if (this.$ws) return

				this.$ws = webSocket(process.env.VUE_APP_WS_URL)

				this.$handleEvents()

				this.$ws.addEventListener('close', () => { location.reload() })
				this.$ws.addEventListener('error', () => { location.reload() })

			},

			async login () {

				const { data } = await this.$api.ws.login(this.$user)

				this.$user = data

				localStorage.setItem('name', data.name)

			},

			async joinRoom (room) {

				if (this.room) return await this.$api.room.joinInv(this.room)
				else return await this.$api.room.join(room)

			},

			connect () {

				this.$user = {
					name: this.$refs.form.name.value,
					color: this.$color,
					lang: this.$lang
				}

			}

		}
	}
</script>
