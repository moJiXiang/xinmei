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
                username: null,
                password: null
            }
        }
    },
    compiled: function(){
        // console.log('test');
    },
    methods: {
        regist: function({e}) {
            e.preventDefault()
            self = this
            this.$http.post(`${config["api_host"]}${config["api_uri"]}/users`, self.user, function(data, status, request) {
                console.log(data);
            })
        }
    }
}
