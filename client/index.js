import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import {configRouter} from './route-config'
require('es6-promise').polyfill()

Vue.use(VueResource)
Vue.use(VueRouter)

const App = Vue.extend(require('./src/app.js'))

const router = new VueRouter({
    history: true,
    saveScrollPosition: true
})

configRouter(router)

router.start(App, '#app')

window.router = router
