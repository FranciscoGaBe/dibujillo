<template>
	<div class="game-users flex flex-col" :class="[`bg-${$mode}-3`]">

		<div
			class="mb-1 p-2 flex items-center shadow-bottom flex-shrink-0"
			:class="[`bg-${$mode}-3`]"
			:style="{ height: topBarHeight }"
		>

			<h2 class="font-bold text-lg truncate flex-grow">{{ $room.name }}</h2>

			<GameUsersRoomOptions/>

		</div>

		<div class="flex-grow">

			<slide-x-left-transition
				group
				tag="div"
				:duration="2000"
			>

				<GameUsersUser
					ref="users"
					v-for="item in $users"
					:key="item.id"
					:user="item"
					:class="[`border-b-2 border-${$mode}-2`]"
				/>

			</slide-x-left-transition>

		</div>

	</div>
</template>

<script>
	import GameUsersRoomOptions from './GameUsersRoomOptions'
	import GameUsersUser from './GameUsersUser'

	export default {
		name: 'GameUsers',
		components: { GameUsersRoomOptions, GameUsersUser },
		props: {
			topBarHeight: {
				type: String,
				default: '4rem'
			}
		},
		data () {
			return {
				points: [],
				userHeight: 0,
				wsEvents: ['users', 'nextTurn']
			}
		},
		methods: {

			calculateUserHeight () {

				if (!this.$refs.users || !this.$refs.users[0]) return

				this.userHeight = parseInt(
					getComputedStyle(this.$refs.users[0].$el)
					.getPropertyValue('height')
				)

			},

			onNextTurn () { this.points = this.$users.map(u => ({ id: u.id, points: u.points })) },

			onUsers (users) {

				const user = users.find(u => u.id === this.$user.id)

				this.$users = users.map(u => {

					const user = {...u, silenced: false},
						us = this.points.find(us => us.id === u.id)

					if (!us) return user

					user.silenced = us.silenced

					if (u.active || !u.guessed) return user

					return {
						...user,
						increment: u.points - us.points
					}

				})

				Object.keys(user).forEach(k => { this.$set(this.$user, k, user[k]) })

				this.$nextTick(() => this.calculateUserHeight())

			}

		}
	}
</script>

<style scoped>

</style>
