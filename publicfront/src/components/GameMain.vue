<template>
	<div class="game-main" :class="[`bg-${$mode}-2`]">

		<div class="h-full flex flex-col relative">

			<div
				class="flex-shrink-0 shadow-bottom flex flex-col"
				:class="[$user.active ? `text-white bg-${$mode}-${$color}` : `text-${$mode}-text`]"
				:style="{ height: topBarHeight }"
			>

				<div class="relative px-8 text-xl font-bold flex-grow flex items-center justify-center truncate">

					<div v-show="!$user.active" >

						<div v-show="$user.waiting">{{ $t('game.waiting') }}...</div>

						<div v-if="word.length" v-show="!$user.waiting" class="tracking-widest">

							<div>

								{{ word[0].toUpperCase() }}

							</div>

							<div class="flex justify-center text-sm">

								<div
									v-for="(item, j) in word.slice(1)"
									:key="item + j"
									class="mx-1"
								>{{ item.toUpperCase() }}</div>

							</div>

						</div>

					</div>

					<div v-if="secretWord.length" v-show="$user.active">

						<div>

							{{ secretWord[0].toUpperCase() }}

						</div>

						<div class="flex justify-center text-sm">

							<div
								v-for="(item, j) in secretWord.slice(1)"
								:key="item + j"
								class="mx-1"
							>{{ item.toUpperCase() }}</div>

						</div>

					</div>

					<div
						v-show="round > 0"
						class="absolute left-0 top-0 bottom-0 flex items-center pl-2 text-xs"
					>

						<div class="text-center">

							<div>{{ $t('game.round') }}</div>

							<div>{{ round }}</div>

						</div>

					</div>

					<div
						v-show="roundTime > 0"
						class="absolute right-0 top-0 bottom-0 flex items-center text-lg pr-1"
					>

						<div
							class="relative h-10 w-10 rounded-full flex items-center justify-center border-2 truncate text-sm"
							:class="[`bg-${$mode}-1 border-${$mode}-3`]"
						>

							<div
								class="absolute bottom-0 left-0 right-0"
								:class="[`bg-${$mode}-${$color}`]"
								:style="{ height: `${turnPercentage}%` }"
							></div>


							<span class="relative">{{ roundTime }}</span>

						</div>

					</div>

				</div>

				<game-main-dropdown
					v-show="$user.active"
					:color.sync="color"
					:size.sync="size"
					:width="width"
					@deleteDrawing="deleteDrawing"
				/>

			</div>

			<div class="flex-grow overflow-hidden flex">

				<div class="flex-shrink-0 flex flex-col py-1 justify-center mr-1">

					<button
						class="flex-grow w-8 focus:outline-none lg:hidden rounded-r-lg mb-1 max-h-64"
						:class="[`bg-${$mode}-3`]"
						@click="$emit('update:show', 'users')"
					><fa icon="users"/></button>

					<game-main-history class="flex-grow max-h-64">

						<template #button="{ onClick }">

							<button
								class="h-full w-8 focus:outline-none rounded-r-lg"
								:class="[`bg-${$mode}-3`]"
								@click="onClick"
							><fa icon="images"/></button>

						</template>

					</game-main-history>

				</div>

				<div class="flex-grow py-2">

					<div
						ref="canvasContainer"
						class="w-full h-full flex items-center justify-center"
					>

						<div class="relative border-4 border-black">

							<canvas
								ref="canvas"
								class="bg-white"
								:class="[$user.active ? 'cursor-none' : 'cursor-not-allowed']"
								@mousemove="onMouseMove"
								@mouseleave="onMouseLeave"
							></canvas>

							<div
								v-show="$user.waiting"
								class="inset-0 absolute bg-black opacity-25 flex
									items-center justify-center text-6xl text-center z-30"
							>{{ $t('game.waitingNextRound') }}</div>

							<div
								v-show="$user.active"
								ref="cursor"
								class="absolute pointer-events-none rounded-full hidden md:block border-2 border-black z-20"
								style="top: -10000px; left: -10000px;"
								:style="{ width: `${size}px`, height: `${size}px`, backgroundColor: color }"
							></div>

							<div
								v-show="!$user.active"
								ref="pen"
								class="absolute pointer-events-none z-20"
								style="top: -10000px; left: -10000px;"
							>

								<fa
									class="absolute bottom-0 left-0"
									icon="pencil-alt"
								/>

							</div>

						</div>

					</div>

				</div>

				<div class="flex-shrink-0 flex flex-col py-1 justify-center ml-1">

					<button
						v-show="!$user.waiting && !$user.active && roundTime"
						class="w-8 text-4xl bg-red-700 flex-grow text-white rounded-l-lg focus:outline-none max-h-64"
						:class="[`border-${$mode}-3 border-2 border-r-0`]"
						@click="reportActivePlayer"
					><fa icon="exclamation"/></button>

					<button
						class="flex-grow w-8 focus:outline-none md:hidden rounded-l-lg max-h-64"
						:class="[`bg-${$mode}-3`]"
						@click="$emit('update:show', 'chat')"
					><fa icon="comments"/></button>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import GameMainDropdown from './GameMainDropdown'
	import GameMainHistory from './GameMainHistory'
	import Paint from '../utils/Paint'

	export default {
		name: 'GameMain',
		components: { GameMainDropdown, GameMainHistory },
		props: {
			topBarHeight: {
				type: String,
				default: '4rem'
			},
			show: {
				type: String,
				required: true
			}
		},
		data () {
			return {
				wsEvents: [
					'draw', 'deleteDrawing', 'instantDraw',
					'word', 'secretWord', 'roundTime',
					'round', 'gameEnd', 'nextTurn', 'gameMessage'
				],
				color: '#000000',
				size: 6,
				word: [],
				secretWord: [],
				roundTime: 0,
				round: 0,
				countdown: null,
				width: 0,
				currentDrawing: [],
				bgColor: 'white',
				resizeTimeout: null,
				paint: null
			}
		},
		computed: {

			turnPercentage () {

				return (this.$room.config.roundTime - this.roundTime) * 100 / this.$room.config.roundTime

			}

		},
		watch: {

			$user: {
				deep: true,
				handler (val) { this.paint.canDraw = val.active }
			},

			color (val) { this.paint.color = val },

			size (val) { this.paint.size = val }

		},
		mounted () {

			this.word = [this.$t('game.waitingPlayers')]

			this.initializeCanvas()

			this.$nextTick(() => this.onResize())

			window.addEventListener('resize', this.onResize)

		},
		beforeDestroy () { window.removeEventListener('resize', this.onResize) },
		methods: {

			onGameMessage ({ word }) {

				this.word = Array.isArray(word) ? word : [word]

			},

			onInstantDraw (data) {

				this.currentDrawing = [...this.drawing, ...data]

				this.paint.draw(data, true)

			},

			onNextTurn () {

				this.size = 10
				this.color = '#000000'
				this.word = [this.$t('game.choosingWord')]

			},

			reportActivePlayer () { this.$api.game.reportactiveplayer({}, { routeParams: { room: this.$room.id } }) },

			onGameEnd () { this.round = 0 },

			onNextRound ({ word }) { this.word = Array.isArray(word) ? word : [word] },

			onRound (round) { this.round = round },

			onMouseLeave () { this.onMouseMove({ offsetX: -10000, offsetY: -10000 }) },

			onMouseMove (ev) {

				const c = this.$refs.cursor

				if (!c) return

				const r = this.size / 2

				c.style.top = ev.offsetY - r + 'px'
				c.style.left = ev.offsetX - r + 'px'

			},

			onRoundTime (time) {

				const countdown = () => {

					this.roundTime--

					if (this.roundTime < 0) return this.roundTime = 0

					this.countdown = setTimeout(countdown, 1000)

				}

				if (this.countdown) {

					clearTimeout(this.countdown)

					this.countdown = null

				}

				this.roundTime = time + 1

				countdown()

			},

			onWord (word) { this.word = Array.isArray(word) ? word : [word] },

			onSecretWord (secretWord) { this.secretWord = Array.isArray(secretWord) ? secretWord : [secretWord] },

			onDeleteDrawing (color = 'white') {

				this.bgColor = color
				this.currentDrawing = []

				this.paint.erase(color)

			},

			deleteDrawing (color) { this.$api.game.deletedrawing({ color }, { routeParams: { room: this.$room.id } }) },

			initializeCanvas () {

				this.paint = new Paint(
					{
						canvas: this.$refs.canvas,
						pen: this.$refs.pen,
						draw: true
					},
					data => {

						if (!this.$user.active || !data.length) return

						this.currentDrawing = [
							...this.currentDrawing,
							...data
						]

						this.$api.game.draw({ data }, { routeParams: { room: this.$room.id } })

					}
				)


			},

			onDraw (data) {

				this.currentDrawing = [
					...this.currentDrawing,
					...data
				]

				this.paint.draw(data)

			},

			onResize () {

				setTimeout(() => {

					if (!this.$refs.canvasContainer) return

					const canvas = this.$refs.canvas,
						aRatio = 5/8,
						cC = this.$refs.canvasContainer,
						width = parseFloat(window.getComputedStyle(cC).getPropertyValue('width')),
						height = parseFloat(window.getComputedStyle(cC).getPropertyValue('height')),
						rW = width / (height * aRatio)

					if (rW < 1) {

						canvas.width  = width
						canvas.height = width / aRatio

					}
					else {

						canvas.width  = height * aRatio
						canvas.height = height

					}

					this.width = canvas.width * .1

					if (canvas.width < 100 || canvas.height < 100) return this.onResize()

					this.resizeTimeout = setTimeout(() => {

						if (!this.paint) return

						this.paint.erase(this.bgColor)
						this.paint.draw(this.currentDrawing, true)

					}, 100)

				}, 200)

			}

		}
	}
</script>

<style scoped>

</style>
