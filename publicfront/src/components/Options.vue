<template>
	<div class="options" v-click-outside="onClickOutside">

		<button
			type="button"
			class="px-2 py-1 focus:outline-none"
			:class="[`text-${size}`, { 'pulse-20': !seen }]"
			@click="show = !show"
		><fa icon="cog"/></button>

		<div class="relative z-50">

			<div
				v-show="show"
				class="absolute rounded right-0 top-0 px-2 pt-2 w-64 border-2"
				:class="[`bg-${$mode}-2 text-${$mode}-text border-${$mode}-3`]"
			>

				<div class="flex items-center justify-between mb-2">

					<span class="mr-4 w-1/2 flex-shrink-0">{{ $t('options.lang') }}:</span>

					<div class="cursor-pointer" @click="showLangs = !showLangs">

						<img class="w-8" :src="`/img/flags/${$lang}.png`" :alt="$lang">

						<div class="relative z-40">

							<div
								v-show="showLangs"
								class="absolute p-2 w-48 border-2 top-0 right-0 flex flex-wrap justify-between"
								:class="[`bg-${$mode}-2 border-${$mode}-3`]"
							>

								<img
									v-for="item in $availableLanguages"
									class="py-1 px-2 cursor-pointer"
									:key="item"
									:src="`/img/flags/${item}.png`"
									:alt="item"
									@click="changeLang(item)"
								>

							</div>

						</div>

					</div>

				</div>

				<div class="flex items-center justify-between mb-2">

					<span class="mr-4 w-1/2 flex-shrink-0">{{ $t('options.volume') }}:</span>

					<input
						type="range"
						class="flex-grow"
						min="0"
						step="0.1"
						max="1"
						v-model="$volume"
					/>

				</div>

				<div class="flex items-center justify-between mb-2 pr-4">

					<span class="mr-4 w-1/2 flex-shrink-0">{{ $t('options.darkMode') }}:</span>

					<d-switch
						class="w-6 h-6 flex-shrink-0"
						v-model="darkMode"
					/>

				</div>

				<div class="flex items-center justify-between">

					<span class="mr-4 w-1/2 flex-shrink-0">{{ $t('options.color') }}:</span>

					<div
						class="w-6 h-6 flex-shrink-0 flex items-end justify-end border-2"
						:class="[`bg-${$mode}-${$color} border-${$mode}-3`]"
						@click="showColors = !showColors"
					>

						<div class="relative -mr-1">

							<div
								v-show="showColors"
								class="absolute top-0 right-0 p-1 rounded mt-1 shadow-lg w-56 flex flex-wrap border-2"
								:class="[`bg-${$mode}-2 border-${$mode}-3`]"
							>

								<div
									v-for="item in colors"
									:key="item"
									class="w-6 h-6 border border-transparent hover:border-black m-px"
									:class="[`bg-${$mode}-${item}`]"
									@click.stop.capture="changeColor(item)"
								></div>

							</div>

						</div>

					</div>

				</div>

				<div class="text-right text-xs mt-2">Dibujillo v.{{ version }}</div>

			</div>

		</div>

	</div>
</template>

<script>
	import { colorArray } from '../utils/colors'

	export default {
		name: 'Options',
		props: {
			size: {
				type: String,
				default: '2xl'
			}
		},
		data () {
			return {
				show: false,
				colors: colorArray,
				showColors: false,
				showLangs: false,
				version: VERSION,
				seen: JSON.parse(localStorage.getItem('optionsSeen')) || false
			}
		},
		computed: {

			darkMode: {
				get () { return this.$mode === 'dark' },
				set (val) { this.$mode = val ? 'dark' : 'light' }
			}

		},
		watch: {

			show () {

				this.seen = true
				localStorage.setItem('optionsSeen', 'true')

			}

		},
		methods: {

			async changeLang (lang) {

				if (this.$ws) {

					const { data } = await this.$api.user.lang({ lang }, { routeParams: { user: this.$user.id } })

					lang = data

				}

				this.$lang = lang

			},

			onClickOutside () {

				this.show = false
				this.showColors = false
				this.showLangs = false

			},

			async changeColor (color) {

				this.showColors = false

				if (this.$ws) {

					const { data } = await this.$api.user.color({ color }, { routeParams: { user: this.$user.id } })

					color = data

				}

				if (this.$user) this.$user.color = color
				this.$color = color

			}

		}
	}
</script>