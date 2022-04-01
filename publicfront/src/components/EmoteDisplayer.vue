<template>
	<div
		class="emote-displayer transition-all duration-300 ease-in-out pointer-events-none"
		:class="[show ? 'opacity-100' : 'opacity-0']"
	>

		<div
			class="bg-white border-2 rounded relative flex items-center shadow-lg"
			:class="[`border-${$mode}-3 bg-${$mode}-1`]"
		>

			<div class="triangle" :class="[`border-${$mode}-3`]"></div>

			<div v-if="!video" class="pulse text-2xl py-2 px-4">{{ emote }}</div>

			<video
				v-else
				ref="video"
				@ended="onVideoEnd"
			></video>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'EmoteDisplayer',
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		data () {
			return {
				show: false,
				video: false,
				emote: '',
				wsEvents: ['emote', 'chat']
			}
		},
		watch: {

			$volume (val) {

				if (!this.$refs.video) return

				this.$refs.video.volume = val

			}

		},
		methods: {

			onEmote ({ emote, type }, user) {

				if (this.show || user.id !== this.user.id || user.id === -1 || this.user.silenced) return

				if (type === 'emote') {

					this.show = true
					this.emote = emote

					setTimeout(() => { this.show = false }, 4000)

				}

			},

			onChat (msg, user) {

				if (this.show || user.id !== this.user.id || user.id === -1 || this.user.silenced) return

				const easterEgg = this.$easterEggs.find(e => e.text === msg)

				if (!easterEgg) return

				this.show = true
				this.video = true

				this.$nextTick(() => {

					const video = this.$refs.video

					video.addEventListener('error', this.onVideoEnd)

					video.src = easterEgg.path || easterEgg.file
					video.volume = this.$volume
					video.play()

				})

			},

			onVideoEnd () {

				this.$refs.video.removeEventListener('error', this.onVideoEnd)

				this.show = false

				setTimeout(() => this.video = false, 300)

			}

		}
	}
</script>

<style scoped>

	.triangle {
		width: 0;
		height: 0;
		border-style: solid;
		border-width: .6rem .8rem .6rem 0;
		border-bottom-color: transparent;
		border-top-color: transparent;
		border-left-color: transparent;
		position: absolute;
		left: -.8rem;
	}

	video {
		width: auto;
		max-width: none;
		max-height: 70px;
	}

</style>