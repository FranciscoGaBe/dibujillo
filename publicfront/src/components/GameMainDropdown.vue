<template>
	<div class="game-main-dropdown relative z-50">

		<div class="absolute left-0 right-0 top-0 px-2">

			<div
				class="p-2 rounded-b-lg shadow-md"
				:class="[ show ? 'flex' : 'hidden', `bg-${$mode}-${$color}` ]"
			>

				<div class="flex-grow mr-4 flex flex-col bg-gray-200 p-1 rounded shadow-lg">

					<div class="flex-shrink-0 flex items-center flex-wrap">

						<button
							v-for="item in colors"
							:key="item.name"
							:title="item.name"
							class="h-6 w-6 m-px focus:outline-none"
							:style="{ backgroundColor: item.hex }"
							@click="colorModel = item.hex"
						></button>

					</div>

					<div class="flex-shrink-0 mt-2 flex items-center mt-2" :style="{ height: `${width}px` }">

						<div class="flex-shrink-0 flex items-center">

							<input
								class="mr-2"
								type="range"
								min="1"
								:max="width"
								v-model="sizeModel"
								@input="sizeChange"
							>

							<div class="text-center" :style="{ width: `${width}px` }">

								<div
									class="rounded-full inline-block"
									:style="{ backgroundColor: color, width: `${sizeModel}px`, height: `${sizeModel}px` }"
								></div>

							</div>

						</div>

						<button
							class="flex-shrink-0 ml-auto px-2 py-1 focus:outline-none text-2xl"
							@click="$emit('deleteDrawing', color)"
						>

							<fa :style="{ color: color }" icon="fill"/>

						</button>

					</div>

				</div>

				<div class="flex-shrink-0 flex flex-col justify-between">

					<button
						class="focus:outline-none text-xl text-white px-1 border-2 rounded"
						:class="[color === 'white' ? 'border-white' : 'border-transparent']"
						@click="colorModel = 'white'"
					><fa icon="eraser"/></button>

					<button
						class="focus:outline-none text-xl text-white px-1"
						@click="$emit('deleteDrawing')"
					><fa icon="trash"/></button>

				</div>

			</div>

			<div class="absolute left-0 right-0 flex justify-center">

				<button
					class="rounded-b-lg text-white px-4 py-1 focus:outline-none absolute shadow-bottom"
					:class="[`bg-${$mode}-${$color}`]"
					@click="show = !show"
				><fa
					class="transition-all duration-300 ease-in-out"
					:style="{ transform: `rotateZ(${show ? '180deg' : '0deg'})` }"
					icon="chevron-down"
				/></button>

			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: "GameMainDropdown",
		props: {
			color: {
				type: String,
				required: true
			},
			size: {
				type: Number,
				required: true
			},
			width: {
				type: Number,
				required: true
			}
		},
		data () {
			return {
				colors: [
					{ name: 'black', hex: '#000000' },
					{ name: 'blue', hex: '#2C9AF3' },
					{ name: 'red', hex: '#FE2224' },
					{ name: 'purple', hex: '#A40094' },
					{ name: 'yellow', hex: '#FEFF00' },
					{ name: 'pink', hex: '#FD4BD7' },
					{ name: 'green', hex: '#15CC0F' },
					{ name: 'orange', hex: '#E45200' },
					{ name: 'lime', hex: '#77FF05' },
					{ name: 'aqua', hex: '#05F3CC' },
					{ name: 'navy', hex: '#0E395B' },
					{ name: 'coral', hex: '#FF974E' },
					{ name: 'teal', hex: '#009788' },
					{ name: 'mustard', hex: '#E1A31C' },
					{ name: 'blue violet', hex: '#7241BE' },
					{ name: 'grey', hex: '#A6A6A6' },
					{ name: 'brown', hex: '#775549' },
					{ name: 'dark green', hex: '#10580F' },
					{ name: 'blue gray', hex: '#607D8B' },
					{ name: 'indigo', hex: '#2C0F7D' },
					{ name: 'pea green', hex: '#56940B' },
					{ name: 'amber', hex: '#FEC601' },
					{ name: 'peach', hex: '#FEAA8E' },
					{ name: 'maroon', hex: '#8A0A09' },
				],
				show: true,
				sizeModel: 6,
				timeout: null
			}
		},
		computed: {

			colorModel: {
				get () { return this.color },
				set (val) { this.$emit('update:color', val) }
			}

		},
		watch: {

			size (val) { this.sizeModel = val },

			width (val) {

				if (this.sizeModel > val) this.sizeModel = val

				this.$emit('update:size', this.sizeModel)

			}

		},
		mounted () { this.sizeModel = this.size },
		methods: {

			sizeChange () {

				if (this.timeout) {

					clearTimeout(this.timeout)

					this.timeout = null

				}

				this.timeout = setTimeout(() => {

					this.$emit('update:size', Number(this.sizeModel))

				}, 300)

			}

		}
	}
</script>