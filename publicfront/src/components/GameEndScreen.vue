<template>
	<div
		v-show="show"
		class="game-end-screen fixed inset-0 pointer-events-none
			z-100 flex items-center justify-center bg-black bg-opacity-50"
	>

		<div
			class="pointer-events-auto z-90 border-2 rounded-lg overflow-hidden screen flex flex-col"
			:class="[`bg-${$mode}-2 border-${$mode}-3`]"
		>

			<div class="text-center text-4xl mb-4 flex-shrink-0">{{ $t('game.gameEnd') }}</div>

			<div
				class="flex items-end border-b-2 text-center justify-center font-bold flex-shrink-0"
				:class="[`border-${$mode}-3`]"
			>

				<div class="w-20 relative z-20" style="right: -2px; bottom: -2px;">

					<div
						v-if="users[1]"
						:title="users[1].name"
						class="truncate p-1"
						:class="[`text-${$mode}-${users[1].color}`]"
					>{{ users[1].name }}</div>

					<div
						class="h-16 border-l-2 border-t-2 relative"
						:class="[`bg-${$mode}-1 border-${$mode}-3`]"
					>

						<span
							v-if="users[1]"
							:class="[`text-${$mode}-${users[1].color}`]"
						>{{ users[1].points }}</span>

					</div>

				</div>

				<div class="w-20 relative z-10" style="bottom: -2px;">

					<div
						v-if="users[0]"
						:title="users[0].name"
						class="truncate p-1"
						:class="[`text-${$mode}-${users[0].color}`]"
					>{{ users[0].name }}</div>

					<div
						class="h-24 border-2 border-b-0"
						:class="[`bg-${$mode}-1 border-${$mode}-3`]"
					>

						<span
							v-if="users[0]"
							:class="[`text-${$mode}-${users[0].color}`]"
						>{{ users[0].points }}</span>

					</div>

				</div>

				<div class="w-20 relative z-20" style="left: -2px; bottom: -2px;">

					<div
						v-if="users[2]"
						:title="users[2].name"
						class="truncate p-1"
						:class="[`text-${$mode}-${users[2].color}`]"
					>{{ users[2].name }}</div>

					<div
						class="h-12 border-t-2 border-r-2"
						:class="[`bg-${$mode}-1 border-${$mode}-3`]"
					>

						<span
							v-if="users[2]"
							:class="[`text-${$mode}-${users[2].color}`]"
						>{{ users[2].points }}</span>

					</div>

				</div>

			</div>

			<div class="py-4 px-10 flex-grow overflow-auto" :class="[`bg-${$mode}-1`]">

				<div
					v-for="(item, i) in users.slice(3)"
					:key="item.id"
					class="p-4 flex items-center justify-between mx-auto"
					:class="[`bg-${$mode}-${item.color}`, i === 0 ? 'rounded-t' : '']"
					:style="getStyles(i)"
				>

					<span class="mr-4">{{ item.name }}</span>

					<span>{{ item.points }}</span>

				</div>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'GameEndScreen',
		data () {
			return {
				wsEvents: ['gameEnd'],
				show: false,
				users: []
			}
		},
		methods: {

			getStyles (i) {

				const bWidth = 30 / (this.users.length - 3)

				return {
					clipPath: `polygon(
						0% 0%,
						100% 0%,
						${100 - (bWidth / 2) * (1 + i * bWidth / 100)}% 100%,
						${(bWidth / 2) * (1 + i * bWidth / 100)}% 100%
					)`,
					width: `${100 - bWidth * i}%`,
					opacity: (100 - bWidth * i) / 100
				}

			},

			onGameEnd (users) {

				this.show = true
				this.users = users
				this.timeout = setTimeout(() => { this.show = false }, 10000)

			}

		}
	}
</script>

<style scoped>

	.screen {
		width: 400px;
		max-width: 95vw;
		max-height: 75vh;
	}

</style>