<template>
	<div class="login-username">

		<label class="w-full">

			<d-input
				class="w-full mb-4"
				type="text"
				name="name"
				v-model="name"
				:placeholder="$t('login.userName')"
			/>

		</label>

		<d-button :disabled="name === ''" block>{{ $t('login.connect') }}</d-button>

	</div>
</template>

<script>
	export default {
		name: 'LoginUsername',
		data () {
			return {
				name: localStorage.getItem('name') || ''
			}
		}
	}
</script>
