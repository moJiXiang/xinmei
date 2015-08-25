import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import {configRouter} from './route-config'
require('es6-promise').polyfill()

Vue.use(VueResource)
Vue.use(VueRouter)

const App = Vue.extend(require('./src/app.js'))

const router = new VueRouter({})

configRouter(router)

router.start(App, '#app')
console.log(router);
router.app.message = require('./utils').messageFactory(router.app)
router.app.config = require('./config').configFactory(router.app)
window.router = router
