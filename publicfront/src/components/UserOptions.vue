<template>
	<div
		class="user-options border-2 rounded"
		:class="[`bg-${$mode}-2 border-${$mode}-3`]"
	>

		<div
			v-for="item in options"
			:key="item.text"
			class="cursor-pointer p-2"
			@click="item.onClick"
		>{{ item.text }}</div>

	</div>
</template>

<script>
	export default {
		name: 'UserOptions',
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		computed: {

			options () {

				const options = [
					{ text: this.$t('user.silenceUser'), onClick: this.silenceUser },
					{ text: this.$t('user.votekick'), onClick: this.votekick }
				]

				if (this.$user.id === this.$room.creator.id) options.push({
					text: this.$t('user.kick'), onClick: this.kick
				})

				return options

			}

		},
		methods: {

			kick () {

				this.$api.game.kick({}, {
					routeParams: {
						user: this.user.id,
						room: this.$room.id
					}
				})

			},

			votekick () {

				this.$api.game.votekick({}, {
					routeParams: {
						user: this.user.id,
						room: this.$room.id
					}
				})

				this.$emit('hide')

			},

			silenceUser () {

				this.user.silenced = !this.user.silenced

				this.$emit('hide')

			}

		}
	}
</script>

<style scoped>

</style>