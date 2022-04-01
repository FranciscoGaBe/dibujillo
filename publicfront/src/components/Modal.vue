<template>
	<div
		v-show="show"
		class="modal fixed inset-0 bg-black z-100 bg-opacity-50 flex items-center justify-center"
		@click.self="onCancel"
	>

		<form
			class="border-2 rounded text-center max-h-80 flex flex-col min-w-64 min-h-40"
			:class="[`bg-${$mode}-2 border-${$mode}-3`]"
			@submit.prevent="onAccept"
		>

			<div class="flex-shrink-0 text-2xl shadow-bottom px-4 py-1 mb-1">{{ title }}</div>

			<div class="flex-grow overflow-auto px-2 flex flex-col justify-center">

				<d-input
					v-for="(item, i) in inputs"
					:key="item.field"
					class="my-1"
					:type="item.type || 'text'"
					:placeholder="item.placeholder"
					block
					:autofocus="i === 0"
					v-model="item.value"
				/>

			</div>

			<div class="flex-shrink-0 flex items-center justify-between px-3 py-2">

				<button
					class="text-red-600 focus:outline-none"
					type="button"
					@click="onCancel"
				>{{ cancelText }}</button>

				<d-button>{{ acceptText }}</d-button>

			</div>

		</form>

	</div>
</template>

<script>
	export default {
		name: 'Modal',
		data () {
			return {
				show: false,
				inputs: [],
				title: '',
				accept: this.close,
				cancel: this.close,
				acceptText: 'Aceptar',
				cancelText: 'Cancelar'
			}
		},
		methods: {

			async onCancel () {

				try {

					await this.cancel()

					this.close()

				}
				catch (err) {

					// eslint-disable-next-line
					console.log(err)

				}

			},

			async onAccept () {

				try {

					await this.accept(this.inputs.reduce((o, i) => {

						o[i.field] = i.value

						return o

					}, {}))

					this.close()

				}
				catch (err) {

					// eslint-disable-next-line
					console.log(err)

				}

			},

			open (options = {}) {

				Object.assign(this.$data, {
					...{
						inputs: [],
						title: '',
						accept: this.close,
						cancel: this.close,
						acceptText: 'Aceptar',
						cancelText: 'Cancelar'
					},
					...options,
					inputs: !options.inputs ? [] : options.inputs.map(i => ({
						...i,
						value: i.value || ''
					}))
				})

				this.show = true

			},

			close () { this.show = false }

		}
	}
</script>

<style scoped>

</style>