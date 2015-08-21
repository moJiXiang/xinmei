require('./style.less')
// config = require('../../config')
import config from '../../config'
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
            }
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
            self.$http.post(`${config["api_url"]}/login`, self.user, function(data, status, request){
                console.log(data);
                console.log(status)

                self.$root.showLogin = false
                self.$root.email = self.user["email"]
                localStorage.setItem('email', self.user["email"])
                localStorage.setItem('token', data.data["token"])

            }).error(function(data, status, request) {
                console.log(data)
                self.shakeError()
                console.log(self.$root.messages);
                console.log(data["message"]);
                self.$root.message.show('error', data["message"]);
                console.log(self.$root);
            })
        },
        signup: function(e) {
            e.preventDefault()
            let self = this
            self.$http.post(`${config["api_url"]}/users`, self.register, function(data, status, request) {

            })
        }
    },
    components: {

    }
}
