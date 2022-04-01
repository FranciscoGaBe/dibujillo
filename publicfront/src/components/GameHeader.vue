<template>
	<div class="px-2 py-1 bg-dark-3 flex items-center justify-between text-dark-text">

		<button
			class="py-1 px-2 focus:outline-none text-2xl"
			@click="leaveRoom"
		><fa icon="door-open"/></button>

		<img
			class="mx-auto rounded-lg h-16"
			src="/img/Logo.png"
			alt="Dibujillo"
		>

		<div v-click-outside="onClickOutside">

			<button
				class="py-1 px-2 focus:outline-none text-2xl"
				@click="show = !show"
			><fa icon="bars"/></button>

			<div class="relative flex justify-center">

				<div
					v-show="show"
					class="absolute top-2 w-64 rounded border-2 bg-dark-2 border-dark-3 right-0 shadow-lg"
				>

					<div
						v-for="(item, i) in options"
						:key="item.text"
						class="cursor-pointer select-none px-2 py-1 transition-colors duration-300
						ease-in-out flex items-center justify-between hover:bg-dark-1 border-dark-3"
						:class="[i !== 0 ? 'border-t-2' : '']"
						@click="item.onClick"
					>

						<span>{{ item.text }}</span>

						<fa v-if="item.icon" :icon="item.icon"/>

					</div>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'GameHeader',
		data () {
			return {
				show: false,
				wsEvents: ['leaveRoom']
			}
		},
		computed: {

			options () {

				return [
					{
						text: this.$t('options.suggestions'),
						icon: 'envelope-open-text',
						onClick: this.onSuggestions
					},
					//{ text: 'Twitter', icon: ['fab', 'twitter'], onClick: () => {} },
					{ text: this.$t('options.credits'), icon: 'wheelchair', onClick: this.onCredits }
				]

			}

		},
		methods: {

			onSuggestions () {

				this.$modal({
					title: this.$t('options.suggestionsTitle'),
					acceptText: this.$t('options.suggestionsAccept'),
					cancelText: this.$t('options.suggestionsCancel'),
					inputs: [
						{ field: 'suggestion', placeholder: this.$t('options.suggestionsPlaceholder') }
					],
					accept: ({ suggestion }) => { this.$api.suggestion.store({ suggestion }) }
				})

			},

			onCredits () { window.open('https://chickenonaraft.com/') },

			onLeaveRoom () {

				this.$room = null
				this.$users = []
				this.show = false

			},

			onClickOutside () { this.show = false },

			leaveRoom () { this.$api.game.leaveroom({}, { routeParams: { room: this.$room.id } }) }

		}
	}
</script>

<style scoped>

</style>