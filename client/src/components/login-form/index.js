require('./style.less')
import Vue from 'vue'

export default {
    template: require('./template.html'),
    data() {
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
    compiled(){
        // console.log('test login');
    },
    methods: {
        shakeError() {
            this.error = true
            setTimeout(()=>{
                this.error = false
            }, 1000)
        },
        login(e) {
            e.preventDefault()
            this.$http.post(`${this.$config["api_url"]}/login`, this.user, function(data, status, request){
                this.$root.showLogin = false
                this.$root.email = this.user["email"]
                localStorage.setItem('email', this.user["email"])
                localStorage.setItem('token', data.data["token"])
                // add Authorization token to http headers
                Vue.http.headers.common['Authorization'] = data.data["token"]

            }).error(function(data, status, request) {
                this.shakeError()
                this.$show('error', data["message"]);
            })
        },
        getCaptcha(e) {
            e.preventDefault()
            this.$http.post(`${this.$config["api_url"]}/sendemail`,this.register, function(data, status, request) {
                this.hasCaptcha = true
            }).error(function(data, status, request) {
                this.shakeError()
                this.$show('error', data["message"]);
            })
        },
        signup(e) {
            e.preventDefault()
            this.$http.post(`${this.$config["api_url"]}/users`, this.register, function(data, status, request) {
                this.$root.showLogin = false
                this.$root.email = this.register["email"]
                localStorage.setItem('email', this.register["email"])
                localStorage.setItem('token', data.data["token"])
            }).error(function(data, status, request) {
                this.shakeError()
                this.$show('error', data["message"]);
            })
        }
    },
    components: {

    }
}
