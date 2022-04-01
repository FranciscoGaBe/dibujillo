<template>
	<div
		class="game-select-word fixed inset-0 pointer-events-none z-100 flex items-center justify-center"

	>

		<div
			class="bg-black inset-0 absolute z-10 transition-opacity duration-300 ease-in-out"
			:class="[show ? 'opacity-50' : 'opacity-0']"
		></div>

		<div
			v-show="show"
			class="p-4 pointer-events-auto z-20 border-2 rounded-lg"
			:class="[`bg-${$mode}-2 border-${$mode}-3`]"
		>

			<div class="text-4xl text-center">{{ $t('game.selectWord') }}</div>

			<div class="text-2xl my-4 text-center">{{ time }}</div>

			<div class="grid">

				<d-button
					v-for="(word, i) in words"
					:key="word + i"
					class="mx-1 flex-grow"
					@click="selectWord(word[0])"
				>

					<div>{{ word[0].toUpperCase() }}</div>

					<div class="flex justify-center text-xs">

						<div
							v-for="(item, j) in word.slice(1)"
							:key="item + j"
							class="mx-1"
						>{{ item.toUpperCase() }}</div>

					</div>

				</d-button>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'GameMainSelectWord',
		data () {
			return {
				show: false,
				timeout: null,
				words: [],
				time: 0,
				wsEvents: ['words']
			}
		},
		methods: {

			selectWord (word) {

				this.$ws.sendMsg('words', word)

				clearTimeout(this.countdown())

				this.timeout = null

			},

			onWords ({ words, time }) {

				this.words = words
				this.time = time
				this.show = true

				this.timeout = setTimeout(this.countdown, 1000)

			},

			countdown () {

				this.time--

				if (this.time > 0 && this.timeout !== null) {

					this.timeout = setTimeout(this.countdown, 1000)

					return

				}

				this.show = false
				this.words = []
				this.time = 0

			}

		}
	}
</script>

<style scoped>

	.grid {
		max-width: 80vw;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: .5rem
	}

</style>