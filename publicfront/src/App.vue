<template>
	<div
		id="app"
		class="flex flex-col select-none"
		:class="[`bg-${$mode}-2 text-${$mode}-text`]"
		:style="{ '--trackcolor': colors[$color], '--color-1': colors['1'], '--color-3': colors['3'] }"
	>

		<admin-msg-displayer v-if="$ws" class="flex-shrink-0"/>

		<Login
			v-if="!$room || !$user"
			class="flex-grow"
			@user="onUser"
			@room="onRoom"
		/>

		<Game
			v-else
			class="flex-grow"
		/>

		<div
			class="flex-shrink-0 z-100 px-2 py-2 border-t-2 flex items-center gap-4 text-2xl leading-none"
			:class="[`bg-${$mode}-3 border-${$mode}-2`]"
		>

			<div class="text-sm">
        <fa icon="copyright"/> Francisco Garrido Bear
      </div>

      <a class="ml-auto" target="_blank" href="https://github.com/FranciscoGaBe/dibujillo">
        <fa :icon="['fab', 'github']"/>
      </a>

			<a target="_blank" href="https://www.linkedin.com/in/francisco-garrido-679084198/">
        <fa :icon="['fab', 'linkedin']"/>
      </a>

		</div>

		<error-displayer v-if="$ws"/>

		<Modal ref="modal"/>

	</div>
</template>

<script>
	import Login from './components/Login'
	import Game from './components/Game'
	import ErrorDisplayer from './components/ErrorDisplayer'
	import AdminMsgDisplayer from './components/AdminMsgDisplayer'
	import Modal from './components/Modal'
	import update from './mixins/update'

	export default {
		name: 'app',
		components: { Login, Game, ErrorDisplayer, AdminMsgDisplayer, Modal },
		mixins: [update],
		data () {
			return {
				cColors: {
					c1: '#ca3e47',
					c2: '#C96C49',
					c3: '#82C953',
					c4: '#2AC9AB',
					c5: '#C434C9',
					c6: '#898CFF',
					c7: '#FF89B5',
					c8: '#FFDC89',
					c9: '#90D4F7',
					c10: '#71E096',
					c11: '#F5A26F',
					c12: '#668DE5',
					c13: '#ED6D79',
					c14: '#5AD0E5',
					c15: '#DA97E0',
					c16: '#CFF381',
					c17: '#FF96E3',
					c18: '#BB96FF',
					c19: '#67EEBD',
				}
			}
		},
		computed: {

			test () { return process.env },

			colors () {

				let output = {...this.cColors}

				if (this.$mode === 'dark') output = {
					...output,
					1: '#525252',
					2: '#414141',
					3: '#313131'
				}
				else output = {
					...output,
					1: '#ffffff',
					2: '#fafafa',
					3: '#cccccc'
				}

				return output

			}

		},
		watch: {

			updateExists (val) {

				if (!val) return

				const updateModal = () => {

					if (!this.$globalModal) return setTimeout(updateModal, 100)

					this.$modal({
						title: this.$t('update.modalTitle'),
						acceptText: this.$t('update.modalAccept'),
						cancelText: this.$t('update.modalCancel'),
						accept: this.refreshApp,
						cancel: this.refreshApp
					})

				}

				updateModal()

			}

		},
		created () {

			if (process.env.NODE_ENV !== 'production') document.title = 'Devbujillo'

		},
		mounted () { this.$nextTick(() => this.$globalModal = this.$refs.modal) },
		methods: {

			onUser (user) { this.$user = user },

			onRoom (room) { this.$room = room }

		}
	}

</script>

<style>

	::-webkit-scrollbar {
		width: .5em;
	}

	::-webkit-scrollbar-track {
		background-color: rgba(0, 0, 0, .2);
	}

	::-webkit-scrollbar-thumb {
		background-color: var(--trackcolor);
		opacity: .2;
	}

	input[type=range] {
		-webkit-appearance: none;
		width: 100%;
		background: transparent;
	}

	input[type=range]:focus {
		outline: none;
	}

	input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
		border: 2px solid var(--color-1);
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 999px;
		background: var(--color-3);
		cursor: pointer;
		margin-top: -.45rem;
	}

	input[type=range]::-moz-range-thumb {
		border: 2px solid var(--color-1);
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 999px;
		background: var(--color-3);
		cursor: pointer;
	}

	input[type=range]::-ms-thumb {
		border: 2px solid var(--color-1);
		height: 1.25rem;
		width: 1.25rem;
		border-radius: 999px;
		background: var(--color-3);
		cursor: pointer;
	}

	input[type=range]::-webkit-slider-runnable-track {
		width: 100%;
		height: .6rem;
		cursor: pointer;
		background: var(--trackcolor);
		border-radius: 999px;
		border: 2px solid var(--color-3);
	}

	input[type=range]::-moz-range-track {
		width: 100%;
		height: .6rem;
		cursor: pointer;
		background: var(--trackcolor);
		border-radius: 999px;
		border: 2px solid var(--color-3);
	}

	input[type=range]::-ms-track {
		width: 100%;
		height: .6rem;
		cursor: pointer;
		background: transparent;
		border-color: transparent;
		border-width: 16px 0;
		color: transparent;
	}

	input[type=range]::-ms-fill-lower {
		background: #2a6495;
		border: 0.2px solid #010101;
		border-radius: 2.6px;
		box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
	}

	input[type=range]:focus::-ms-fill-lower {
		background: #3071a9;
	}

	input[type=range]::-ms-fill-upper {
		background: #3071a9;
		border: 0.2px solid #010101;
		border-radius: 2.6px;
		box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
	}

	input[type=range]:focus::-ms-fill-upper {
		background: #367ebd;
	}

</style>