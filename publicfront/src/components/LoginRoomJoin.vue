<template>
	<div class="login-room-join overflow-auto">

		<template v-if="rooms.length">

			<div class="grid">

				<div
					v-for="item in rooms"
					:key="item.id"
					class="text-center p-2 shadow rounded"
					:class="[`bg-${$mode}-1`]"
				>

					<h2 class="font-bold text-xl truncate" :title="item.name">{{ item.name }}</h2>

					<h3 class="text-lg truncate">{{ item.collectionName }}</h3>

					<div class="mb-2">{{ item.users }} / {{ item.maxPlayers }}</div>

					<d-button
						block
						type="button"
						@click="join(item.id)"
					>Unirse</d-button>

				</div>

			</div>

		</template>

		<div v-else-if="loading" class="text-center text-4xl mt-4">{{ $t('login.loadingRooms') }}</div>

		<div v-else class="text-center text-4xl mt-4">{{ $t('login.noRooms') }}</div>

	</div>
</template>

<script>
	export default {
		name: "LoginRoomJoin",
		data () {
			return {
				rooms: [],
				loading: false
			}
		},
		mounted () { this.getRooms() },
		methods: {

			async getRooms () {

				if (this.loading) return

				this.loading = true

				const { data } = await this.$api.room.index()

				this.rooms = data

				this.loading = false

			},

			join (id) { this.$emit('join', { id }) }

		}
	}
</script>

<style scoped>

	.login-room-join {
		width: 80vw;
	}

	.grid {
		max-height: 60vh;
		display: grid;
		gap: .5rem;
		grid-template-columns: repeat(auto-fit, minmax(150px, 200px));
		grid-auto-rows: min-content;
	}

</style>