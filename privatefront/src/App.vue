<template>
	<div id="app" class="bg-dark-2 text-dark-text">

		<login v-if="!token" class="h-full" @token="onToken"/>

		<template v-else>

			<dashboard class="h-full"/>

		</template>

	</div>
</template>

<script>
	import Login from './components/Login'
	import Dashboard from './components/Dashboard'

	export default {
		name: 'app',
		components: { Login, Dashboard },
		data () {
			return {
				token: localStorage.getItem('panelAccessToken') || ''
			}
		},
		created () { if (this.token) this.$setAuth('Bearer ' + this.token) },
		methods: {

			onToken (token) {

				this.token = token

				localStorage.setItem('panelAccessToken', token)

				this.$setAuth('Bearer ' + token)

			}

		}
	}

</script>

<style>

	::-webkit-scrollbar {
		width: .3em;
	}

	::-webkit-scrollbar-track {
		border-radius: 999px;
	}

	::-webkit-scrollbar-thumb {
		background-color: #CA3E47;
		opacity: .2;
		border-radius: 999px;
	}

</style>