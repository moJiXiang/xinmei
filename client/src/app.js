require('./app.less')
require('./less/ui.less')
require('./less/animate.less')

export default {
    template: require('./app.html'),
    data: function() {
        return {
            showLogin: false,
            email: null,
            messages: []
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
    },
    methods: {
        logout: function() {
            this.email = null
            localStorage.removeItem('email')
        }
    }
}
