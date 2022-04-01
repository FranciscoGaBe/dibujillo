<template>
	<div class="login-room">

		<div class="mb-4 relative text-center px-8">

			<button
				v-show="show !== ''"
				type="button"
				class="py-1 px-2 text-sm focus:outline-none absolute left-0 top-0 bottom-0 flex items-center"
				@click="show = ''"
			><fa icon="chevron-left"/></button>

			<p>{{ $t('login.welcome') }} {{ $user.name }}</p>

		</div>

		<login-room-select
			v-if="show === ''"
			v-model="show"
		/>

		<login-room-join
			v-else-if="show === 'public'"
			v-model="show"
			@join="room => $emit('join', room)"
		/>

		<login-room-join-private
			v-else-if="show === 'private'"
			v-model="show"
			@join="room => $emit('join', room)"
		/>

		<login-room-new
			v-else
			v-model="show"
			@create="room => $emit('create', room)"
		/>

	</div>
</template>

<script>
	import LoginRoomSelect from "./LoginRoomSelect"
	import LoginRoomJoin from './LoginRoomJoin'
	import LoginRoomNew from './LoginRoomNew'
	import LoginRoomJoinPrivate from './LoginRoomJoinPrivate'

	export default {
		name: 'LoginRoom',
		components: { LoginRoomSelect, LoginRoomJoin, LoginRoomNew, LoginRoomJoinPrivate },
		data () {
			return {
				show: ''
			}
		}
	}
</script>
