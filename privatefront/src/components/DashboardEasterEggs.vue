<template>
	<div class="dashboard-easter-eggs p-4">

		<div class="mb-4 flex">

			<d-input class="flex-grow mr-2" placeholder="Texto" v-model="text"/>

			<d-input ref="file" class="flex-grow mr-2" type="file" placeholder="Video" v-model="file"/>

			<d-button class="flex-shrink-0" :disabled="!text || !file" @click="newEasterEgg">Añadir</d-button>

		</div>

		<div class="grid">

			<div
				v-for="item in easterEggs"
				:key="item.text"
				class="text-center rounded shadow bg-dark-1 border-dark-3 border-2 p-2 cursor-pointer"
			>

				<h2 class="mb-2 flex justify-between items-center">

					<span>{{ item.text }}</span>

					<button
						class="text-red-700 focus:outline-none"
						@click="deleteEasterEgg(item.text)"
					><fa icon="trash"/></button>

				</h2>

				<video :src="item.path" @click="ev => ev.target.play()"></video>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: 'DashboardEasterEggs',
		data () {
			return {
				easterEggs: [],
				text: '',
				file: null
			}
		},
		mounted () { this.getEasterEggs() },
		methods: {

			async deleteEasterEgg (value) {

				if (!confirm(`Borrar ${value}`)) return

				const { data } = await this.$api.easteregg.delete({ text: value })

				this.easterEggs = data

			},

			async newEasterEgg () {

				if (!this.text || !this.file) return

				const formData = new FormData()

				formData.append('text', this.text)
				formData.append('file', this.$refs.file.$refs.input.files[0])

				const { data } = await this.$api.easteregg.store(formData)

				this.easterEggs = data

				this.text = ''
				this.file = null

			},

			async getEasterEggs () {

				const { data } = await this.$api.easteregg.index()

				this.easterEggs = data

			}

		}
	}
</script>

<style scoped>


	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 250px));
		grid-auto-rows: min-content;
		gap: .3rem;
	}

</style>