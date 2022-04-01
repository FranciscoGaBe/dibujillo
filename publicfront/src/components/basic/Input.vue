<template>
	<input
		ref="input"
		:class="bClass"
		v-bind="{...$attrs, ...$props}"
		v-on="listeners"
		:value="value"
		@input="$emit('input', $event.target.value)"
	>
</template>

<script>
	export default {
		name: "Input",
		props: {
			value: {},
			text: {
				type: String,
				default: 'default'
			},
			rounded: {
				type: Boolean,
				default: true
			},
			color: {
				type: String,
				default: '1'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			borderColor: {
				type: String,
				default: 'default'
			},
			block: {
				type: Boolean,
				default: false
			}
		},
		data () {
			return {
				classes: [
					'px-2 py-1',
					'shadow-lg',
					'focus:outline-none',
					'border-2',
					'border-transparent',
					'transition duration-300 ease-in-out'
				]
			}
		},
		computed: {

			listeners () {


				return Object.keys(this.$listeners).filter(k => k !== 'input').reduce((o, k) => {

					o[k] = this.$listeners[k]

					return o

				},{})

			},

			bClass () {

				const text = this.text === 'default' ? `${this.$mode}-text` : this.text,
					bColor = this.borderColor === 'default' ? this.$color : this.borderColor

				return [
					...this.classes,
					...[
						this.block ? 'block w-full' : '',
						`text-${text}`,
						this.rounded ? 'rounded' : '',
						`bg-${this.$mode}-${this.color}`,
						`focus:border-${this.$mode}-${bColor}`,
					]
				]

			}

		}
	}
</script>

<style scoped>

</style>