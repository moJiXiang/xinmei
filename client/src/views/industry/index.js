require('./style.less')
require('./industrychart.less')
import {draw} from './industry.js'

export default {
    template: require('./template.html'),
    data() {
        return {
            industry: null
        }
    },
    ready() {

    },
    compiled() {
        this.$root.isDashboard = false
    },
    methods: {
        update(lcid) {
            this.$http.get(`${this.$config.api_url}/industrychart/${lcid}`, (data, status, request)=> {
                // this.industry = data.data
                draw(data.data)
            })
        }
    },
    route: {
        data ({to: {params: {lcid}}}) {
            this.update(lcid)
        }
    }
}
