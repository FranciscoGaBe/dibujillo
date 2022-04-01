import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import BasicComponents from './plugins/BasicComponents'
import './assets/tailwind.css'
import './utils/utils'
import 'typeface-roboto-condensed'
import './assets/custom.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueClickOutside from 'vue-click-outside'
import Transitions from 'vue2-transitions'
import Translations from './plugins/Translations'
import GlobalData from './plugins/GlobalData'
import Axios from './plugins/Axios'

Vue.config.productionTip = false

library.add(fas)
library.add(fab)
Vue.component('fa', FontAwesomeIcon)

Vue.directive('click-outside', VueClickOutside)

Vue.use(BasicComponents)
Vue.use(Transitions)
Vue.use(Translations)
Vue.use(GlobalData)
Vue.use(Axios)

new Vue({
  render: h => h(App)
}).$mount('#app')
