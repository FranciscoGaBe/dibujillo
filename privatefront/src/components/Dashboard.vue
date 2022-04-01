<template>
	<div class="dashboard flex flex-col">

		<DashboardGraphs class="flex-shrink-0"/>

		<div class="flex-grow flex p-4">

			<div class="flex-shrink-0 mr-2 bg-dark-1 border-2 border-dark-3 rounded w-40 text-center">

				<div
					class="cursor-pointer py-2 hover:bg-dark-2 border-dark-3 border-t border-b"
					@click="logout"
				><fa icon="sign-out-alt"/></div>

				<div
					v-for="item in tabs"
					:key="item"
					class="cursor-pointer py-2 hover:bg-dark-2 border-dark-3 border-t border-b"
					:class="[show === item ? 'bg-dark-c1' : 'bg-dark-3']"
					@click="show = item"
				>{{ item }}</div>

			</div>

			<component :is="show" class="flex-grow"/>

		</div>

	</div>
</template>

<script>
	import DashboardGraphs from './DashboardGraphs'
	import DashboardRooms from './DashboardRooms'
	import DashboardMessages from './DashboardMessages'
	import DashboardCollections from './DashboardCollections'
	import DashboardSuggestions from './DashboardSuggestions'
	import DashboardEasterEggs from './DashboardEasterEggs'

	export default {
		name: 'Dashboard',
		components: {
			DashboardGraphs,
			rooms: DashboardRooms,
			messages: DashboardMessages,
			collections: DashboardCollections,
			suggestions: DashboardSuggestions,
			eastereggs: DashboardEasterEggs
		},
		data () {
			return {
				tabs: ['rooms', 'collections', 'eastereggs', 'messages', 'suggestions'],
				show: ''
			}
		},
		created () { this.show = this.tabs[0] },
		methods: {

			logout () {

				localStorage.removeItem('panelAccessToken')

				location.reload()

			}

		}
	}
</script>

<style scoped>

</style>