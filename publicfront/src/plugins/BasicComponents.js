import Button from '../components/basic/Button'
import Input from '../components/basic/Input'
import Select from '../components/basic/Select'
import Switch from '../components/basic/DSwitch'

export default {

	install (Vue) {

		Vue.component('dButton', Button)
		Vue.component('dInput', Input)
		Vue.component('dSelect', Select)
		Vue.component('dSwitch', Switch)

	}

}