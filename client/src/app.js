require('./app.less')
require('./less/ui.less')
require('./less/animate.less')
require('./less/common.less')
import config from './config'

export default {
    template: require('./app.html'),
    data: function() {
        return {
            showLogin: false,
            email: null,
            messages: [],
            isDashboard: false
        }
    },
    components: {
        "overlay": function(resolve) {
            require(["./components/overlay"], resolve)
        },
        "login-form": function(resolve) {
            require(["./components/login-form"], resolve)
        }
    },
    compiled: function(){
        this.email = localStorage.getItem('email')
        this.$http.get(`${config["api_url"]}/checkactive`, function(data) {
            console.log(data);
        }, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).error(function(data){
            this.email = null
            localStorage.removeItem('email')
            localStorage.removeItem('token')
            window.router.go('/forbidden')
        })
    },
    methods: {
        logout: function() {
            this.email = null
            localStorage.removeItem('email')
            localStorage.removeItem('token')
        }
    }
}
