<template>
	<div
		class="game-users-user select-none"
		v-click-outside="onClickOutside"
	>

		<div
			class="flex relative cursor-pointer px-2 py-3 h-full"
			:class="[user.active ? `bg-${$mode}-${user.color} text-white` : '']"
			@click="showOptions = !showOptions"
		>

			<div class="flex-grow mr-3 flex flex-col justify-between">

				<div class="flex items-center justify-between text-sm mb-3">

					<fa
						v-if="user.id === $room.creator.id"
						icon="crown"
					/>

					<fa
						v-else
						icon="user"
					/>

					<div v-show="user.increment" class="text-xs">+ {{ user.increment }}</div>

					<fa
						:class="{ 'opacity-0' : !user.silenced }"
						icon="comment-slash"
					/>

					<fa
						:class="[user.drawn ? '' : (user.active ? 'opacity-25' : 'opacity-0')]"
						icon="pencil-alt"
					/>

				</div>

				<span class="truncate" :title="user.name">{{ user.name }}</span>

			</div>

			<span class="flex-shrink-0 flex items-center text-sm">{{ user.points }}</span>

			<div
				v-show="user.waiting"
				class="inset-0 absolute flex items-center justify-center"
			>

				<div class="absolute inset-0 bg-black opacity-75 z-10"></div>

				<div class="relative z-20 text-xl font-bold">En espera</div>

			</div>

			<div class="relative">

				<EmoteDisplayer
					class="ml-5 absolute left-0 top-0 bottom-0 flex items-center"
					:user="user"
				/>

			</div>

		</div>

		<div class="relative px-2">

			<UserOptions
				v-if="user.id !== $user.id"
				v-show="showOptions"
				class="absolute z-90 -mt-2"
				:user="user"
				@hide="showOptions = false"
			/>

		</div>

	</div>
</template>

<script>
	import EmoteDisplayer from './EmoteDisplayer'
	import UserOptions from './UserOptions'

	export default {
		name: 'GameUsersUser',
		components: { EmoteDisplayer, UserOptions },
		props: {
			user: {
				type: Object,
				required: true
			}
		},
		data () {
			return {
				showOptions: false
			}
		},
		methods: {

			onClickOutside () { this.showOptions = false }

		}
	}
</script>