require('./style.less')
require('./industrychart.less')
import config from '../../config'
import {draw} from './industry.js'

export default {
    template: require('./template.html'),
    data: function(){
        return {
            industry: null,
            lcid: null
        }
    },
    ready: function() {
        this.$watch('industry', (value, mutation)=> draw(value))
    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {
        update: function() {
            let self = this
            self.$http.get(`${config.api_url}/industrychart/${self.lcid}`, function(data, status, request) {
                self.industry = data.data
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            })
        }
    },
    route: {
        data ({to: {params: {lcid}}}) {
            console.log(lcid);
            this.lcid = lcid
            this.update()
        }
    }
}
