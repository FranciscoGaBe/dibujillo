<template>
	<div class="game-main-history-drawing flex">

		<div class="flex-shrink-0 mr-2">

			<img ref="img" class="border-2 border-black rounded" :alt="`${drawing.drawer}-${drawing.word}`">

		</div>

		<div class="flex-grow flex flex-col p-2">

			<div class="text-2xl truncate" :title="drawing.drawer">{{ drawing.drawer }}</div>

			<div class="text-lg truncate" :title="drawing.word">{{ drawing.word }}</div>

			<div class="mt-auto">

				<d-button
					block
					:title="$t('history.download')"
					@click="downloadDrawing"
				>{{ $t('history.download') }}</d-button>

			</div>

		</div>

		<a ref="a" class="hidden"></a>

	</div>
</template>

<script>
	import Paint from '../utils/Paint'

	export default {
		name: 'GameMainHistoryDrawing',
		props: {
			drawing: {
				type: Object,
				required: true
			}
		},
		mounted () { this.initializeCanvas() },
		methods: {

			downloadDrawing () {

				const a = this.$refs.a

				a.download = `${this.drawing.drawer}-${this.drawing.word}.png`
				a.href = this.$refs.img.src

				a.click()

			},

			initializeCanvas () {

				const canvas = document.createElement('canvas'),
					paint = new Paint({ canvas })

				canvas.width = 1000
				canvas.height = 1600

				paint.erase(this.drawing.bg)
				paint.draw(this.drawing.data, true)

				this.$refs.img.src = canvas.toDataURL()

			},

		}
	}
</script>

<style scoped>

	img {
		max-width: 100px;
	}

</style>