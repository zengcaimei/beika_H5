import Vue from 'vue'
import App from './App'
import api from './api/index.js'
import http from './api/http.js'

Vue.config.productionTip = false

Vue.prototype.$baseUrl = api
Vue.prototype.$http = http

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
