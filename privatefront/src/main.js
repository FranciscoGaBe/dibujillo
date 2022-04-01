import Vue from 'vue'
import App from './App.vue'
import BasicComponents from '../../publicfront/src/plugins/BasicComponents'
import '../../publicfront/src/assets/tailwind.css'
import '../../publicfront/src/utils/utils'
import 'typeface-roboto-condensed'
import '../../publicfront/src/assets/custom.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import GlobalData from '../../publicfront/src/plugins/GlobalData'
import Axios from './plugins/Axios'

Vue.config.productionTip = false

library.add(fas)
library.add(fab)
Vue.component('fa', FontAwesomeIcon)

Vue.use(BasicComponents)
Vue.use(GlobalData)
Vue.use(Axios)

new Vue({
  render: h => h(App)
}).$mount('#app')
