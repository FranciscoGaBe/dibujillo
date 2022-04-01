<template>
	<div class="dashboard-graphs p-4 relative">

		<d-input
			class="absolute right-5 top-5"
			v-model="date"
			@keydown.enter="updateData"
		/>

		<line-chart
			class="bg-dark-1 border-2 border-dark-3 rounded shadow-lg"
			:chart-data="perfomanceData"
			:height="200"
			:options="options"
		/>

	</div>
</template>

<script>
	import LineChart from '../graphs/LineChart'
	import moment from 'moment'

	export default {
		name: 'DashboardGraphs',
		components: { LineChart },
		data () {
			return {
				perfomance: [],
				date: moment(new Date()).format('YYYY-MM-DD'),
				timeout: null,
				options: {
					scales: {
						yAxes: [{
							ticks: {
								suggestedMin: 0,
								suggestedMax: 100
							}
						}]
					},
					legend: {
						labels: {
							fontColor: "white"
						}
					},
					maintainAspectRatio: false
				}
			}
		},
		computed: {

			perfomanceData () {

				return {
					labels: this.perfomance.map(p => p[3].slice(11)),
					datasets: [
						{
							label: 'CPU',
							backgroundColor: '#ca3e47',
							data: this.perfomance.map(p => p[0])
						},
						{
							label: 'Memory',
							backgroundColor: '#313131',
							data: this.perfomance.map(p => p[1])
						},
						{
							label: 'Rooms',
							backgroundColor: '#67EEBD',
							data: this.perfomance.map(p => p[2])
						}
					]
				}

			}

		},
		created () { this.updateData() },
		methods: {

			async updateData () {

				if (this.timeout) {

					clearTimeout(this.timeout)

					this.timeout = null

				}

				const { data } = await this.$api.admin.perfomance({
					date: this.date
				})

				this.perfomance = data

				this.timeout = setTimeout(this.updateData, 60 * 1000)

			}

		}
	}
</script>