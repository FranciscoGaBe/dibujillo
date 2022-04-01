<template>
	<form
		id="login"
		class="flex items-center justify-center"
		@submit.prevent="connect"
	>

		<div class="rounded p-4 bg-dark-2 border-2 border-dark-3 shadow-lg">

			<d-input block class="mb-4" type="user" placeholder="Usuario" v-model="name" autofocus/>

			<d-input block class="mb-4" type="password" placeholder="Contraseña" v-model="password"/>

			<d-button block :disabled="!name || !password">Conectar</d-button>

		</div>

	</form>
</template>

<script>
	export default {
		name: 'Login',
		data () {
			return {
				name: '',
				password: ''
			}
		},
		methods: {

			async connect () {

				try {

					const { data } = await this.$api.auth.login({
						name: this.name,
						password: this.password
					})

					this.$emit('token', data.token)

				}
				catch (err) { alert(err.response.data.error) }

			},

		}
	}
</script>
