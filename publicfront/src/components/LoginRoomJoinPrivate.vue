<template>
	<form class="login-room-join-private" @submit.prevent.stop.capture="join" @input="msg = ''">

		<d-input
			block
			name="code"
			:placeholder="$t('login.code')"
			autocomplete="off"
			v-model="code"
		/>

		<d-input
			class="mt-2 mb-4"
			name="room-password"
			type="password"
			autocomplete="off"
			block
			:placeholder="$t('login.password')"
			v-model="password"
		/>

		<d-button block :disabled="!code || !password">{{ $t('login.joinRoom') }}</d-button>

	</form>
</template>

<script>
	export default {
		name: 'LoginRoomJoinPrivate',
		data () {
			return {
				code: '',
				password: ''
			}
		},
		methods: {

			join () {

				this.$emit('join', {
					id: this.code,
					password: this.password
				})

				this.code = ''
				this.password = ''

			}

		}
	}
</script>