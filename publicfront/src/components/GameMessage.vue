<template>
	<div class="game-message fixed inset-0 flex items-center justify-center z-60 pointer-events-none">

		<div
			v-show="show"
			class="border-2 rounded flex items-center py-2 px-4 slide"
			:class="[`border-${$mode}-3 bg-${$mode}-2`]"
		>

			<h2 class="text-xl">{{ title }}</h2>

			<div
				v-show="body"
				class="text-4xl ml-4"
				:class="[`text-${$mode}-${color}`]"
			>{{ body }}</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'GameMessage',
		data () {
			return {
				wsEvents: ['gameMessage'],
				show: false,
				title: '',
				body: '',
				color: '2'
			}
		},
		methods: {

			onGameMessage ({ msg }, user) {

				this.title = msg
				this.body = user ? user.name : ''
				this.color = user ? user.color : '2'

				this.show = true

				setTimeout(() => this.show = false, 4500)

			}

		}
	}
</script>

<style scoped>

</style>