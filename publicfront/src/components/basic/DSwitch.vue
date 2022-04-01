<template>
	<label class="cursor-pointer">

		<input
			class="hidden"
			type="checkbox"
			v-model="model"
		/>

		<div
			class="h-5 w-10 rounded-full relative flex items-center transition-all duration-300 ease-in-out border-2"
			:class="[`border-${$mode}-3`, model ? `bg-${$mode}-${$color}` : `bg-${$mode}-2`]"
		>

			<div
				class="h-5 w-5 absolute rounded-full border-2"
				:class="[`bg-${$mode}-3 border-${$mode}-1`, model ? '-right-1' : '-left-1']"
			></div>

		</div>

	</label>
</template>

<script>
	export default {
		name: "DSwitch",
		props: {
			value: {}
		},
		computed: {

			model: {
				get () { return this.value },
				set (val) { this.$emit('input', val) }
			}

		}
	}
</script>

<style scoped>



</style>