<template>
	<div class="dashboards-rooms flex flex-col">

		<div class="flex-shrink-0 text-center text-2xl">Total salas: {{ rooms.length }}</div>

		<div class="flex-grow overflow-auto grid p-2">

			<div
				v-for="item in rooms"
				:key="item.id"
				class="p-2 text-center bg-dark-1 border-2 border-dark-3 rounded shadow-lg text-xs"
			>

				<div class="flex items-center justify-between">

					<span>{{ item.id }} - {{ item.name }}</span>

					<span>

						<fa v-show="item.private" icon="lock"/>

					</span>

				</div>

				<div class="my-2">

					<span
						class="px-2 py-1 rounded"
						:class="[`bg-${stateColors[item.state]}-600`]"
					>{{ item.state }}</span>

				</div>

				<div class="flex items-center justify-between">

					<span>Colleción:</span>

					<span>{{ item.collectionName }}</span>

				</div>

				<div v-show="item.state === 'waiting'">

					<div class="flex items-center justify-between">

						<span>Empieza con:</span>

						<span>{{ item.minStart }}</span>

					</div>

				</div>

				<div v-show="item.state === 'playing'">

					<div class="flex items-center justify-between">

						<span>Ronda:</span>

						<span>{{ item.round }} / {{ item.rounds }}</span>

					</div>

				</div>

				<div class="mt-2" :title="item.users.reduce((o, u) => o + u + ';', '')">

					<h4 class="text-sm">Usuarios ({{ item.users.length }}/{{ item.maxPlayers }})</h4>

					<div class="overflow-auto">

						<div
							v-for="(u, i) in item.users"
							:key="u + i"
							:class="[`text-${$mode}-${u.color}`]"
						>{{ u.name }}</div>

					</div>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'DashboardRooms',
		data () {
			return {
				timeout: null,
				rooms: [],
				stateColors: {
					waiting: 'yellow',
					playing: 'green',
					starting: 'red'
				},
				destroyed: false
			}
		},
		mounted () { this.updateData() },
		beforeDestroy () { this.destroyed = true },
		methods: {

			async updateData () {

				if (this.destroyed) return

				if (this.timeout) {

					clearTimeout(this.timeout)

					this.timeout = null

				}

				const { data } = await this.$api.room.index()

				this.rooms = data

				this.timeout = setTimeout(this.updateData, 5000)

			}

		}
	}
</script>

<style scoped>

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 250px));
		grid-auto-rows: min-content;
		gap: .3rem;
	}

</style>