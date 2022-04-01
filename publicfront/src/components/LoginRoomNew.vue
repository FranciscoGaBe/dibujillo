<template>
	<form class="login-room-new" @submit.prevent.stop.capture="createRoom">

		<div class="flex-grow overflow-auto px-2 w-64">

			<div
				v-for="item in showInputs"
				:key="item.field"
				class="my-2"
			>

				<d-select
					v-if="item.type === 'collection'"
					v-model="values[item.field]"
					block
					:options="collections"
				/>

				<div
					v-else-if="item.type === 'switch'"
					class="flex items-center justify-between"
				>

					<span>{{ item.placeholder }}</span>

					<d-switch v-model="values[item.field]"/>

				</div>

				<textarea
					v-else-if="item.type === 'words'"
					v-show="showWords"
					class="w-full rounded shadow-lg resize-none focus:outline-none border-2 border-transparent px-2 py-1"
					rows="5"
					:class="[`bg-${$mode}-1 focus:border-${$mode}-${$color}`]"
					:placeholder="$t('createRoom.words')"
					v-model="values[item.field]"
				></textarea>

				<d-input
					v-else
					v-model="values[item.field]"
					:type="item.type"
					:min="item.min"
					:max="item.max"
					:placeholder="item.placeholder"
					block
				/>

			</div>

		</div>

		<div class="flex-shrink-0">

			<button
				type="button"
				class="text-xs my-2 focus:outline-none"
				:class="[`text-${$mode}-${$color}`]"
				@click="advanced = !advanced"
			>{{ advanced ? $t('createRoom.showLess') : $t('createRoom.showMore') }}</button>

			<d-button block>{{ $t('createRoom.create') }}</d-button>

		</div>

	</form>
</template>

<script>
	export default {
		name: "LoginRoomNew",
		data () {
			return {
				advanced: false,
				collections: [],
				values: {}
			}
		},
		computed: {

			showInputs () { return this.inputs.filter(i => this.advanced ? true : !i.advanced) },

			showWords () { return this.values.collection === 'custom' },

			inputs () { return [
				{ field: 'name', type: 'text', placeholder: this.$t('createRoom.name'), required: true },
				{ field: 'password', type: 'text', placeholder: this.$t('createRoom.password') },
				{ field: 'private', type: 'switch', placeholder: this.$t('createRoom.private') },
				{ field: 'collection', type: 'collection', placeholder: this.$t('createRoom.collection'), value: `basic${this.$lang.toUpperCase()}` },
				{ field: 'words', type: 'words' },
				{ field: 'maxPlayers', type: 'number', placeholder: this.$t('createRoom.maxPlayers'), min: 1, max: 10, advanced: true },
				{ field: 'minStart', type: 'number', placeholder: this.$t('createRoom.minStart'), min: 1, max: 10, advanced: true },
				{ field: 'rounds', type: 'number', placeholder: this.$t('createRoom.rounds'), min: 1, max: 10, advanced: true },
				{ field: 'roundTime', type: 'number', placeholder: this.$t('createRoom.roundTime'), min: 10, max: 200, advanced: true },
				{ field: 'wordShowRounds', type: 'number', placeholder: this.$t('createRoom.wordShowRounds'), min: 0, max: 10, advanced: true },
				{ field: 'shownWordPercentage', type: 'number', placeholder: this.$t('createRoom.shownWordPercentage'), min: 0, max: 100, advanced: true },
			] }

		},
		created () {

			this.collections = [{
				text: this.$t('createRoom.loadingCollections'),
				value: `basic${this.$lang.toUpperCase()}`
			}]

		},
		mounted () {

			this.values = this.inputs.reduce((o, i) => {

				o[i.field] = i.value || ''

				return o

			}, {})

			this.getCollections()

		},
		methods: {

			async getCollections () {

				const { data } = await this.$api.collection.index()

				this.collections = data

			},

			createRoom () { this.$emit('create', this.values) }

		}
	}
</script>

<style scoped>

	.login-room-new {
		max-height: 60vh;
		display: flex;
		flex-direction: column;
	}

</style>