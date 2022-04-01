<template>
	<div class="dashboard-collections flex flex-col text-center">

		<template v-if="!collectionData">

			<div class="flex-shrink-0 mb-2 flex items-center justify-center">

				<span class="text-2xl mr-4">Total colecciones: {{ collections.length }}</span>

				<d-input placeholder="Filtrar" v-model="filterCollections"/>

			</div>

			<form
				class="flex-shrink-0 flex items-center justify-between px-2 pb-2 mb-2 shadow-bottom"
				@submit.prevent="newCollection"
			>

				<span>Nueva colleción:</span>

				<d-input placeholder="Nombre" v-model="cName"/>

				<d-input placeholder="Valor" v-model="cValue"/>

				<d-input placeholder="Idioma" v-model="cLang"/>

				<d-button :disabled="!cName || !cValue">Crear</d-button>

			</form>

			<div class="flex-grow">

				<draggable class="grid" :list="filteredCollections" @change="changePosition">

					<div
						v-for="item in filteredCollections"
						:key="item.name"
						class="bg-dark-1 border-2 rounded border-dark-3 p-2 cursor-pointer flex items-center"
						@click="select(item.value)"
					>

						<div class="flex-grow">

							<div class="mb-2">{{ item.name }}</div>

							<div class="text-sm">{{ item.value }} ({{ item.lang }})</div>

						</div>

						<button
							class="p-1 text-dark-c1 focus:outline-none"
							@click.capture.stop="deleteCollection(item.value)"
						><fa icon="trash"/></button>

					</div>

				</draggable>

			</div>

		</template>

		<template v-if="collectionData">

			<div class="flex-shrink-0 text-2xl relative mb-4">

				<button
					class="focus:outline-none px-2 py-1 left-0 top-0 bottom-0 flex items-center absolute"
					@click="collectionData = null"
				><fa icon="chevron-left"/></button>

				<span>{{ collectionData.name }}</span>

			</div>

			<div class="flex-grow flex flex-col">

				<div class="mb-3 flex-shrink-0">

					<span class="mr-4 text-xl">Palabras ({{ collectionData.words.length }}):</span>

					<d-input v-model="filterWords" placeholder="Filtrar"/>

				</div>

				<div class="grid overflow-auto flex-grow px-2 text-center">

					<div
						v-for="item in words"
						:key="item[0]"
						:title="item[0]"
						class="bg-dark-1 rounded border-2 border-dark-3 truncate flex items-center px-2"
					>

						<div class="flex-grow">

							<div>{{ item[0] }}</div>

							<div class="flex justify-center text-xs">

								<div
									v-for="w in item.slice(1)"
									:key="w"
									class="mx-1"
								>{{ w }}</div>

							</div>

						</div>

						<fa
							icon="trash"
							class="text-dark-c1 cursor-pointer flex-shrink-0"
							@click="deleteWord(item[0])"
						/>

					</div>

				</div>

				<div class="flex-shrink-0 py-2 px-4 flex">

					<textarea
						class="w-full bg-dark-1 border-transparent border-2 rounded focus:border-dark-c1
						focus:outline-none px-2 py-1 mr-2 shadow-lg resize-none"
						placeholder="palabras separadas por ;"
						v-model="newWords"
					></textarea>

					<d-button @click="addWords">Añadir</d-button>

				</div>

			</div>

		</template>

	</div>
</template>

<script>
	import draggable from 'vuedraggable'

	export default {
		name: 'DashboardCollections',
		components: { draggable },
		data () {
			return {
				collections: [],
				selected: -1,
				collectionData: null,
				filterWords: '',
				newWords: '',
				filterCollections: '',
				cName: '',
				cValue: '',
				cLang: ''
			}
		},
		computed: {

			words () {

				if (!this.collectionData) return

				return this.collectionData.words.filter(w =>
					w[0].toLowerCase().indexOf(this.filterWords.toLowerCase()) > -1
				)

			},

			filteredCollections () {

				return this.collections.filter(c =>
					c.name.toLowerCase().indexOf(this.filterCollections.toLowerCase()) > - 1 ||
					c.value.toLowerCase().indexOf(this.filterCollections.toLowerCase()) > - 1
				)

			}

		},
		mounted () { this.getCollections() },
		methods: {

			async getCollections () {

				const { data } = await this.$api.collection.index()

				this.collections = data

			},

			async changePosition (ev) {

				if (!ev.moved) return

				const { data } = await this.$api.collection.arrange({
					oldIndex: ev.moved.oldIndex,
					newIndex: ev.moved.newIndex
				})

				this.collections = data

			},

			async deleteCollection (value) {

				if (!confirm(`Borrar la colección ${value}`)) return

				const { data } = await this.$api.collection.delete({}, {
					routeParams: {
						id: value
					}
				})

				this.collections = data

			},

			async newCollection () {

				if (!this.cName || !this.cValue) return

				const { data } = await this.$api.collection.store({
					name: this.cName,
					value: this.cValue,
					lang: this.cLang || 'all'
				})

				this.collections = data
				this.cName = this.cValue = this.cLang = ''

			},

			async deleteWord (word) {

				const { data } = await this.$api.collection.word.delete({ word: word }, {
					routeParams: {
						id: this.collectionData.value
					}
				})

				this.collectionData = data

			},

			async addWords () {

				const { data } = await this.$api.collection.word.store({ words: this.newWords }, {
					routeParams: {
						id: this.collectionData.value
					}
				})

				this.collectionData = data
				this.newWords = ''

			},

			async select (value) {

				const { data } = await this.$api.collection.show({}, {
					routeParams: {
						id: value
					}
				})

				this.collectionData = data

			}

		}
	}
</script>

<style scoped>

	.grid {
		display: grid;
		gap: .3rem;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		grid-auto-rows: min-content;
	}

</style>