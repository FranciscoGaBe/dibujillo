<template>
	<div class="emotes w-full select-none" v-click-outside="onClickOutside">

		<div class="relative">

			<div
				v-show="show"
				class="absolute bottom-0 rounded border-2 flex flex-col
				holder w-full pointer-events-auto"
				:class="[`bg-${$mode}-1 border-${$mode}-3`]"
			>

				<div
					class="flex-shrink-0 flex border-2 text-lg"
					:class="[`bg-${$mode}-3 border-${$mode}-2`]"
				>

					<div
						v-for="(members, group) in emotes"
						:key="group"
						class="flex-shrink-0 cursor-pointer flex items-center"
						:class="[group === selectedGroup ? `bg-${$mode}-2` : '']"
						:title="group"
						@click="selectedGroup = group"
					>

						<div
							class="transform hover:scale-125 p-1"
						>{{ members[0][0] }}</div>

					</div>

					<div class="ml-auto text-2xl text-center">

						<div class="relative">

							<div
								v-show="showColors"
								class="absolute bottom-px left-0 w-full border-2 border-b-0 rounded-t overflow-hidden"
								:class="[`bg-${$mode}-3 border-${$mode}-2`]"
							>

								<div
									v-for="(item, i) in colorEmotes"
									:key="item"
									class="cursor-pointer"
									:class="[`hover:bg-${$mode}-1`]"
									@click="skinTone = i"
								>{{ item }}</div>

							</div>

						</div>

						<div
							class="py-1 px-3 cursor-pointer"
							@click="showColors = !showColors"
						>{{ colorEmotes[skinTone] }}</div>

					</div>

				</div>

				<div class="overflow-auto text-xl grid flex-grow">

					<div
						v-for="emote in showEmotes"
						:key="emote[0]"
						class="cursor-pointer transform hover:scale-125 flex items-center justify-center overflow-hidden"
						@click="sendEmote(emote)"
					>{{ emote[0] }}</div>

				</div>

			</div>

		</div>

		<slot name="trigger">

			<button
				type="button"
				class="p-2 focus:outline-none pointer-events-auto"
				@click="onShow"
			>{{ buttonEmote }}</button>

		</slot>

	</div>
</template>

<script>
	import emotes from '../utils/emotes.json'

	export default {
		name: 'Emotes',
		data () {
			return {
				emotes: emotes,
				show: false,
				buttonEmote: '👌',
				selectedGroup: '',
				skinTone: 1,
				skinTones: ['standard', 'light', 'medium-light', 'medium', 'medium-dark', 'dark'],
				colorEmotes: [],
				showColors: false
			}
		},
		computed: {

			showEmotes () {

				if (!this.selectedGroup) return []

				const skinTone = this.skinTones[this.skinTone]

				if (this.selectedGroup !== 'People & Body') return this.emotes[this.selectedGroup]

				return this.emotes[this.selectedGroup].filter(e => !e[1] || e[1] === skinTone)

			}

		},
		mounted () {

			this.selectedGroup = Object.keys(this.emotes)[0]

			this.changeButton()

			this.colorEmotes = this.emotes['People & Body'].filter(e => e[0].indexOf('👌') > -1 && e[1]).map(e => e[0])

		},
		methods: {

			changeButton () { this.buttonEmote = this.emotes['Smileys & Emotion'].random()[0] },

			onClickOutside () {

				this.show = false
				this.showColors = false

			},

			sendEmote (emote, type = 'emote') {

				if (this.$room.config.collection === '😂') {

					this.$emit('chat', emote)

				}
				else {

					this.$api.game.emote({
						emote: {
							type,
							emote: emote[0]
						}
					}, { routeParams: { room: this.$room.id } })

				}

				this.show = false
				this.showColors = false

			},

			onShow () {

				this.changeButton()

				this.show = !this.show

			}

		}
	}
</script>

<style scoped>

	.holder {
		height: 300px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, 2.38rem);
		grid-auto-rows: min-content;
		gap: 2px;
	}

</style>