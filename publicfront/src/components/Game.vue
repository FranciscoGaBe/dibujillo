<template>
	<div id="game" class="flex flex-col">

		<game-header
			class="flex-shrink-0 relative z-90 border-b-2"
			:class="[`border-${$mode}-${$user.active ? $color : '2'}`]"
		/>

		<div class="flex flex-grow relative">

			<div
				class="lg:hidden absolute inset-0 bg-black opacity-50 z-60"
				:class="[show !== '' ? 'block' : 'hidden']"
				@click="show = ''"
			></div>

			<game-users
				class="lg:w-1/6 lg:static transition-all duration-300 ease-in-out"
				:class="[...generalClasses, show === 'users' ? 'z-70' : 'z-50']"
				:style="{ left: show === 'users' ? '0' : '-83.33%' }"
				:topBarHeight="topBarHeight"
			/>

			<game-main
				class="w-full md:static md:w-3/5 lg:w-3/6 z-10"
				:topBarHeight="topBarHeight"
				:show.sync="show"
			/>

			<game-chat
				class="md:w-2/5 lg:w-2/6 transition-all duration-300 ease-in-out md:static"
				:class="[...generalClasses, show === 'chat' ? 'z-70' : 'z-50']"
				:style="{ right: show === 'chat' ? '0' : '-83.33%' }"
				:topBarHeight="topBarHeight"
			/>

			<game-select-word/>
			<game-end-screen/>
			<game-message/>

		</div>

	</div>
</template>

<script>
	import GameChat from './GameChat'
	import GameUsers from './GameUsers'
	import GameMain from './GameMain'
	import GameSelectWord from './GameSelectWord'
	import GameEndScreen from './GameEndScreen'
	import GameHeader from './GameHeader'
	import GameMessage from './GameMessage'

	export default {
		name: 'Game',
		components: {
			GameChat,
			GameUsers,
			GameMain,
			GameSelectWord,
			GameEndScreen,
			GameHeader,
			GameMessage
		},
		data () {
			return {
				show: '',
				topBarHeight: '4rem',
				generalClasses: ['flex-shrink-0 absolute top-0 bottom-0 w-10/12']
			}
		},
		mounted () {

			if (!this.$easterEggs.length) this.loadEasterEggs()

		},
		methods: {

			async loadEasterEggs () {

				const { data } = await this.$api.easteregg.index()

				this.$easterEggs = data

			},

			onShow (show) { this.show = show }

		}
	}
</script>
