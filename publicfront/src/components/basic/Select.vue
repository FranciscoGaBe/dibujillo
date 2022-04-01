<template>
	<select
		:class="bClass"
		v-bind="{...$attrs, ...$props}"
		v-model="model"
	>

		<option
			v-for="item in list"
			:key="item.value"
			:value="item.value"
		>{{ item.text }}</option>

	</select>
</template>

<script>
	export default {
		name: "Select",
		props: {
			value: {},
			options: {
				type: Array,
				default: () => []
			},
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
				default: 'c1'
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

			model: {
				get () { return this.value },
				set (val) { this.$emit('input', val) }
			},

			list () {

				return this.options.map(o => {

					if (typeof o === 'string') return { text: o, value: o }

					return o

				})

			},

			bClass () {

				const text = this.text === 'default' ? `${this.$mode}-text` : this.text

				return [
					...this.classes,
					...[
						this.block ? 'block w-full' : '',
						`text-${text}`,
						this.rounded ? 'rounded' : '',
						`bg-${this.$mode}-${this.color}`,
						`focus:border-${this.$mode}-${this.borderColor}`,
					]
				]

			}

		}
	}
</script>