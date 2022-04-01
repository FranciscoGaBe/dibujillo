<template>
	<div class="login-room-select">

		<d-button
			v-for="item in buttons"
			:key="item.value"
			class="my-2"
			block
			@click="$emit('input', item.value)"
		>{{ item.text }}</d-button>

	</div>
</template>

<script>
	export default {
		name: "LoginRoomSelect",
		props: {
			value: {
				type: String,
				default: ''
			}
		},
		computed: {

			buttons () { return [
				{ text: this.$t('login.joinPublicRoom'), value: 'public' },
				{ text: this.$t('login.joinPrivateRoom'), value: 'private' },
				{ text: this.$t('login.createRoom'), value: 'new' }
			]}

		}
	}
</script>

<style scoped>

</style>