<template>
	<div class="login-invited-room text-center">

		<h2 class="font-bold text-2xl truncate">{{ room.name }}</h2>

		<h2 class="font-bold text-lg truncate">{{ room.owner }}</h2>

		<h3 class="truncate">{{ room.collection_name }}</h3>

		<div class="mb-6">{{ room.players }} / {{ room.max_players }}</div>

		<label class="w-full">

			<d-input
				class="w-full mb-4"
				type="text"
				name="name"
				v-model="name"
				:placeholder="$t('login.userName')"
			/>

		</label>

		<d-button
			:disabled="name === ''"
			block
			@click="$emit('join', room.code)"
		>{{ $t('login.connect') }}</d-button>

	</div>
</template>

<script>
	export default {
		name: 'LoginInvitedRoom',
		props: {
			room: {
				type: Object,
				required: true
			}
		},
		data () {
			return {
				name: localStorage.getItem('name') || ''
			}
		}
	}
</script>
