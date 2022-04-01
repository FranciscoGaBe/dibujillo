<template>
	<div class="dashboard-messages overflow-auto pr-1">

		<div
			v-for="item in suggestions"
			:key="item"
			class="flex items-center justify-between px-2 py-1 rounded border-2 border-dark-3 bg-dark-1 my-1"
		>

			<span>{{ item }}</span>

			<button
				class="focus:outline-none px-2 py-1 text-red-600"
				@click="deleteSuggestion(item)"
			><fa icon="trash"/></button>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'DashboardSuggestions',
		data () {
			return {
				suggestions: []
			}
		},
		created () { this.getSuggestions() },
		methods: {

			async getSuggestions () {

				const { data } = await this.$api.suggestion.index()

				this.suggestions = data

			},

			async deleteSuggestion (suggestion) {

				const { data }  = await this.$api.suggestion.delete({ suggestion })

				this.suggestions = data

			},

		}
	}
</script>

<style scoped>

</style>