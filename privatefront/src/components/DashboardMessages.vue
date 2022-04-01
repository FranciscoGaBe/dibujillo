<template>
	<form class="dashboard-messages p-4 text-center" @submit.prevent="sendMsg">

		<d-input
			v-model="msg"
			block
			placeholder="Mensajito"
		/>

	</form>
</template>

<script>
	export default {
		name: 'DashboardMessages',
		data () {
			return {
				msg: ''
			}
		},
		methods: {

			sendMsg () {

				this.$api.admin.message({
					msg: this.msg
				})

				this.msg = ''

			}

		}
	}
</script>

<style scoped>

</style>