import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueGoogleCharts from 'vue-google-charts'
import Multiselect from 'vue-multiselect'

Vue.component('multiselect', Multiselect) 
Vue.use(VueGoogleCharts)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
