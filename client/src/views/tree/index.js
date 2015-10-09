require('./style.less')
require('./tree.less')
import {draw} from './tree.js'

export default {
    template: require('./template.html'),
    data: function() {
        return {
            lcid: null,
            enterprise: null,
            tree: null
        }
    },
    ready: function() {
        this.$watch('tree', function(value, mutation) {
            draw(value)
        })
    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {
        update: function() {
            let self = this
            self.$http.get(`${self.$config.api_url}/enterprises/${self.lcid}`, function(data, status, request) {
                self.enterprise = data.data["enterprise"]
            }).error(function(data){
                self.$root.message.show('error', data["message"]);
            })

            self.$http.get(`${self.$config.api_url}/tree/${self.lcid}`, function(data, status, request) {
                self.tree = data.data
            }).error(function(data) {
                self.$root.message.show('error', data["message"]);
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
