require('./style.less')
// config = require('../../config')
export default {
    template: require('./template.html'),
    data: function() {
        return {
            loginTab: true,
            error: false,
            user: {
                email: null,
                password: null,
                permanent: false
            },
            register: {
                email: null,
                username: null,
                password: null
            },
            hasCaptcha: false
        }
    },
    compiled: function(){
        // console.log('test login');
    },
    methods: {
        shakeError: function() {
            this.error = true
            setTimeout(function() {
                this.error = false
            }.bind(this), 1000)
        },
        login: function(e) {
            e.preventDefault()
            let self = this
            self.$http.post(`${self.$root.config["api_url"]}/login`, self.user, function(data, status, request){
                self.$root.showLogin = false
                self.$root.email = self.user["email"]
                localStorage.setItem('email', self.user["email"])
                localStorage.setItem('token', data.data["token"])

            }).error(function(data, status, request) {
                self.shakeError()
                self.$root.message.show('error', data["message"]);
            })
        },
        getCaptcha: function(e) {
            e.preventDefault()
            let self = this
            self.$http.post(`${self.$root.config["api_url"]}/sendemail`,self.register, function(data, status, request) {
                self.hasCaptcha = true
            }).error(function(data, status, request) {
                self.shakeError()
                self.$root.message.show('error', data["message"]);
            })
        },
        signup: function(e) {
            e.preventDefault()
            let self = this
            self.$http.post(`${self.$root.config["api_url"]}/users`, self.register, function(data, status, request) {
                self.$root.showLogin = false
                self.$root.email = self.register["email"]
                localStorage.setItem('email', self.register["email"])
                localStorage.setItem('token', data.data["token"])
            }).error(function(data, status, request) {
                self.shakeError()
                self.$root.message.show('error', data["message"]);
            })
        }
    },
    components: {

    }
}
