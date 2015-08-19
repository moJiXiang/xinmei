require('./style.less')
// config = require('../../config')
import config from '../../config'
export default {
    template: require('./template.html'),
    replace: true,
    data: function() {
        return {
            user: {
                email: null,
                password: null
            }
        }
    },
    compiled: function(){
        // console.log('test login');
    },
    methods: {
        login: function(e) {
            e.preventDefault()
            let self = this
            this.$http.post(`${config["api_host"]}${config["api_uri"]}/login`, self.user, function(data, status, request){
                console.log(data);
                window.router.go('/')
                localStorage.setItem('email', self.user["email"])
                localStorage.setItem('token', data.data["token"])
            })
        }
    },
    components: {

    }
}
