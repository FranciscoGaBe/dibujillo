<template>
	<div
		v-show="show"
		class="error-displayer fixed inset-0 bg-black z-100 bg-opacity-75 flex items-center justify-center"
	>

		<div
			class="p-4 rounded border-2"
			:class="[`bg-${$mode}-2 border-${$mode}-3`]"
		>

			<div>{{ error }}</div>

			<div class="text-right mt-4">

				<button
					class="focus:outline-none"
					:class="[`text-${$mode}-${$color}`]"
					@click="accept"
				>Aceptar</button>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'ErrorDisplayer',
		data () {
			return {
				show: false,
				error: ''
			}
		},
		created () { this.$ws.on('errorMsg', this.onErrorMsg) },
		beforeDestroy () { this.$ws.del('errorMsg', this.onErrorMsg) },
		methods: {

			accept () {

				this.error = ''
				this.show = false

			},

			onErrorMsg (error) {

				this.error = error
				this.show = true

			}

		}
	}
</script>

<style scoped>

</style>