require('./app.less')
require('./less/ui.less')
require('./less/animate.less')
require('./less/common.less')
import {Config} from '../config'
export default {
    template: require('./app.html'),
    data() {
        return {
            showLogin: false,
            email: null,
            messages: this.$messages,
            isDashboard: false
        }
    },
    components: {
        "overlay": function(resolve) {
            require(["./components/overlay"], resolve)
        },
        "login-form": function(resolve) {
            require(["./components/login-form"], resolve)
        },
        'show-modal': function(resolve) {
            require(["./components/modal"], resolve)
        }
    },
    // TODO: how to add headers before each request
    compiled() {
        this.email = localStorage.getItem('email')
        console.log(this.$messages);
        this.$http.get(`${this.$config["api_url"]}/checkactive`, function(data) {
            console.log(data);
        }, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).error(function(data){
            this.email = null
            localStorage.removeItem('email')
            localStorage.removeItem('token')
            // TODO: it's not recommend to use window
            window.router.go('/forbidden')
        })
    },
    methods: {
        logout() {
            this.email = null
            localStorage.removeItem('email')
            localStorage.removeItem('token')
        }
    }
}
