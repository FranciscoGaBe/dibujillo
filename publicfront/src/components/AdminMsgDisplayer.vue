<template>
	<div class="admin-msg-displayer relative">

		<div
			v-show="show"
			class="p-2 text-center flex items-center"
			:class="[`bg-${$mode}-${$color}`]"
		>

			<div class="flex-grow">{{ msg }}</div>

			<button
				class="flex-shrink-0 focus:outline-none p-1"
				@click="show = false"
			><fa icon="times"/></button>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'AdminMsgDisplayer',
		data () {
			return {
				show: false,
				msg: '',
				wsEvents: ['adminMsg']
			}
		},
		methods: {

			onAdminMsg (msg) {

				if (msg === '') {

					this.msg = ''
					this.show = false

					return

				}

				this.msg = msg
				this.show = true

			}

		}
	}
</script>

<style scoped>

</style>