require('./style.less')
import config from '../../config'

export default {
    template: require('./template.html'),
    data: function(){

    },
    components: {

    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {
        queryEntsByName: function(e) {
            e.preventDefault()
            let self = this
            self.$http.get(`${config.api_url}/enterprises?name=${self.enterprise}`, function(data, status, request) {
                if(data)
                    self.show = true
                    self.$set('enterprises', data.data)
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function (data, status, request) {

            })
        }
    }
}
