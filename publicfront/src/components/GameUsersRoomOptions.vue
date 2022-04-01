<template>
	<div class="game-users-room-options" v-click-outside="onClickOutside">

		<button
			class="flex-shrink-0 p-2 focus:outline-none"
			@click="show = !show"
		><fa icon="chevron-down"/></button>

		<div class="relative">

			<div
				v-show="show"
				class="absolute top-0 left-0 p-2 border-2 rounded w-56 z-50 -ml-32"
				:class="[`bg-${$mode}-2 border-${$mode}-3`]"
			>

				<div class="flex items-center justify-between mb-2">

					<span class="mr-2">{{ $t('room.code') }}:</span>

					<span class="flex-shrink-0">{{ $room.id }}</span>

				</div>

				<div
					class="cursor-pointer text-xs"
					:class="[`text-${$mode}-${$color}`]"
					@click="showConfig = !showConfig"
				>{{ showConfig ? $t('room.configShowLess') : $t('room.configShowMore') }}</div>

				<div v-show="showConfig">

					<div
						v-for="item in config"
						:key="item.field"
						class="flex items-center justify-between my-1"
					>

						<span class="mr-2 text-sm" :title="item.name">{{ item.name }}:</span>

						<span :title="item.value">{{ item.value }}</span>

					</div>

				</div>

				<d-button
					class="invite-button mt-4"
					block :data-clipboard-text="invite"
					@click="show = false"
				>Copiar invitación</d-button>

			</div>

		</div>

	</div>
</template>

<script>
	import ClipboardJS from 'clipboard'

	export default {
		name: 'GameUsersRoomOptions',
		data () {
			return {
				wsEvents: ['updateRoomInfo'],
				show: false,
				invite: '',
				showConfig: false
			}
		},
		computed: {

			config () { return [
				{ field: 'maxPlayers', name: this.$t('room.maxPlayers') },
				{ field: 'minStart', name: this.$t('room.minStart') },
				{ field: 'rounds', name: this.$t('room.rounds') },
				{ field: 'roundTime', name: this.$t('room.roundTime') },
				{ field: 'shownWordPercentage', name: this.$t('room.shownWordPercentage') },
				{ field: 'wordShownRounds', name: this.$t('room.wordShownRounds') },
				{ field: 'private', name: this.$t('room.private') },
				{ field: 'collection', name: this.$t('room.collection') },
			].map(c => ({ ...c, value: this.$room.config[c.field] })) }

		},
		created () {

			const url = new URL(location.href)

			this.invite = `${url.origin}/r/${this.$room.code}`

			new ClipboardJS('.invite-button')

		},
		methods: {

			onUpdateRoomInfo (room) { Object.assign(this.$room, room) },

			onClickOutside () {

				this.show = false
				this.showConfig = false

			},

		}
	}
</script>

<style scoped>

</style>