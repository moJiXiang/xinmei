import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Config from './config'
import Utils from './utils'
import {configRouter} from './route-config'
require('es6-promise').polyfill()

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Config)
Vue.use(Utils)
// add Authorization token to http headers
Vue.http.headers.common['Authorization'] = localStorage.getItem('token')
const App = Vue.extend(require('./src/app.js'))
const router = new VueRouter({})

configRouter(router)
router.start(App, '#app')
// console.log(router.app);
// require('./utils').messageFactory(router.app)
// require('./config').configFactory(router.app)
window.router = router
