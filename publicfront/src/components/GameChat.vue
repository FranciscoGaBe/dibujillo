<template>
	<div class="game-chat flex-col flex" :class="[`bg-${$mode}-3`]">

		<div
			class="flex-shrink-0 p-2 flex items-center shadow-bottom"
			:class="[`bg-${$mode}-2`]"
			:style="{ height: topBarHeight }"
		>

			<options class="ml-auto"/>

		</div>

		<div ref="chat" class="flex-grow overflow-auto flex flex-col justify-end">

			<div>

				<div
					v-for="(item, i) in history"
					:key="i"
					class="break-words px-4 my-px flex-shrink-0"
					:class="[
						item.user.id === -1 ? 'text-base text-gray-600' : 'text-sm',
						{
							'opacity-25': item.waiting === 'yes',
							'bg-red-700 text-white': item.waiting === 'error'
						}
					]"
					:style="item.user.id === -1 ? `color: ${item.user.color}` : ''"
				>

					<span
						v-if="item.user.id !== -1"
						class="font-bold"
						:class="[`text-${$mode}-${item.user.color}`]"
					>{{ item.user.name }}</span>

					<span
						v-if="item.user.id !== -1 && item.msg.slice(0, 3) !== '/me'"
						class="mr-1"
						:class="[`text-${$mode}-${item.user.color}`]"
					>:</span>

					<span
						v-if="item.msg.slice(0, 3) === '/me'"
						:class="[`text-${$mode}-${item.user.color}`]"
					>{{ item.msg.slice(3) }}</span>

					<span v-else>{{ item.msg }}</span>

					<span
						v-if="item.waiting === 'yes'"
						class="ml-2"
						:title="$t('chat.sending')"
					><fa class="spin" icon="spinner"/></span>

					<span
						v-else-if="item.waiting === 'error'"
						class="ml-2"
						:title="$t('chat.error')"
					><fa icon="exclamation-circle"/></span>

				</div>

			</div>

		</div>

		<form
			class="p-2 flex-shrink-0 flex items-center relative"
			:class="[`bg-${$mode}-3`]"
			@submit.prevent="sendMsg(msg)"
		>

			<div class="absolute inset-0 mx-2 flex items-center pointer-events-none">

				<emotes @chat="emojiChat"/>

			</div>

			<label class="flex-grow mr-2">

				<d-input
					class="w-full outline-none rounded pl-8"
					:class="[`bg-${$mode}-1`]"
					type="text"
					v-model="msg"
				/>

			</label>

			<d-button
				class="text-sm h-full"
				:disabled="msg === '' || this.timeout !== null"
			><fa icon="paper-plane"/> {{ $t('chat.send') }}</d-button>

		</form>

		<audio
			v-for="item in audios"
			:key="item.name"
			:ref="`audio-${item.name}`"
			:src="item.path"
		></audio>

	</div>
</template>

<script>
	import Options from './Options'
	import Emotes from './Emotes'

	export default {
		name: 'GameChat',
		components: { Options, Emotes },
		props: {
			topBarHeight: {
				type: String,
				default: '4rem'
			}
		},
		data () {
			return {
				msg: '',
				wsEvents: ['chat'],
				history: [],
				timeout: null,
				audios: [
					{ name: 'usermsg', path: '/audio/usermsg.webm' },
					{ name: 'adminmsg', path: '/audio/adminmsg.webm' },
				]
			}
		},
		watch: { $volume (val) { this.changeAudioVolume(val) } },
		mounted () { this.changeAudioVolume() },
		methods: {

			changeAudioVolume (val) {

				if (!val) val = this.$volume

				Object.keys(this.$refs).filter(k => k.slice(0, 5) === 'audio')
					.forEach(a => this.$refs[a][0].volume = val)

			},

			emojiChat (emoji) {

				this.msg = emoji
				this.sendMsg()

			},

			onChat (msg, user, waiting = 'no') {

				if (this.$easterEggs.find(e => e.text === msg)) return {}

				const u = this.$users.find(u => u.id === user.id)

				if (!this.$refs.chat || (u && u.silenced)) return

				const message = {
					msg,
					user,
					waiting
				}

				this.history.push(message)

				if (this.history.length > 400) this.history = this.history.slice(-300)

				this.$nextTick(() => {

					const audio = this.$refs[user.id === -1 ? 'audio-adminmsg' : 'audio-usermsg'][0]

					this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight

					audio.pause()
					audio.currentTime = 0
					audio.play()

				})

				return message

			},

			async sendMsg (msg) {

				if (this.timeout !== null) return
				if (!msg.trim()) return this.msg = ''

				const easterEgg = this.$easterEggs.find(e => e.text === msg)

				if (easterEgg) {

					this.$ws.dispatchEvent(new CustomEvent('chat', {
						detail: {
							msg,
							user: {
								id: this.$user.id
							}
						}
					}))

				}

				this.timeout = setTimeout(() => this.timeout = null, 200)
				this.msg = ''

				const message = this.onChat(msg, this.$user, 'yes')

				try {

					const { data } = await this.$api.game.message.store({ msg }, { routeParams: { room: this.$room.id } })

					if (msg === data) message.waiting = 'no'
					else this.history.splice(this.history.findIndex(h => h === message), 1)

				}
				catch (err) {

					message.waiting = 'error'

					console.log(err)

				}

			}

		}
	}
</script>
