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

console.log(router);
router.start(App, '#app')
console.log('入口－－－－－－－－－－－－－－－');
console.log(router.app);
require('./utils').messageFactory(router.app)
require('./config').configFactory(router.app)
window.router = router
