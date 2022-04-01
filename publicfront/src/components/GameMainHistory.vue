<template>
	<div class="game-main-history">

		<slot name="button" :onClick="buttonClick">

			<button
				class="rounded-full h-10 w-10 focus:outline-none shadow-lg pointer-events-auto"
				:class="[`bg-${$mode}-${$color}`]"
				@click="buttonClick"
			><fa icon="images"/></button>

		</slot>

		<div
			v-show="show"
			class="absolute inset-0 p-1 bg-black bg-opacity-75 pointer-events-auto z-50"
		>

			<div
				class="h-full rounded flex flex-col overflow-hidden"
				:class="[`bg-${$mode}-2`]"
			>

				<div class="flex-shrink-0 pl-2 py-2 flex items-center justify-between" :class="[`bg-${$mode}-3`]">

					<div>

						<div class="text-lg">{{ $t('history.title') }}</div>

						<div class="text-xs">{{ $t('history.subtitle') }}</div>

					</div>

					<button class="focus:outline-none px-2 py-1" @click="show = !show"><fa icon="times"/></button>

				</div>

				<div v-show="loading" class="text-center flex-shrink-0 my-2">

					<fa class="spin text-2xl" icon="spinner"/>

				</div>

				<div class="flex-grow overflow-auto p-2 grid">

					<game-main-history-drawing
						v-for="(item, i) in history"
						:key="`${item.drawer}-${item.word}-${i}`"
						class="p-2 rounded shadow-lg"
						:class="[`bg-${$mode}-1`]"
						:drawing="item"
					/>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	import GameMainHistoryDrawing from './GameMainHistoryDrawing'

	export default {
		name: 'GameMainHistory',
		components: { GameMainHistoryDrawing },
		data () {
			return {
				wsEvents: ['history'],
				show: false,
				history: [],
				loading: false
			}
		},
		watch: {

			show (val) {

				if (!val) return

				this.getHistory()

			}

		},
		methods: {

			buttonClick () { this.show = !this.show },

			async getHistory () {

				if (this.loading) return
				this.loading = true

				try {

					const { data } = await this.$api.game.history.index(
						{ historyLength: this.history.length },
						{ routeParams: { room: this.$room.id } }
					)

					this.history = [
						...this.history,
						...data
					]

					this.loading = false

				}
				catch (err) {

					this.loading = false

					console.log(err)

				}

			}

		}
	}
</script>

<style scoped>

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		grid-auto-rows: min-content;
		gap: .5rem;
	}

</style>