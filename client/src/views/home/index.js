require('./style.less')
import config from '../../config'

export default {
    template: require('./template.html'),
    data: function(){
        return {
            enterprise: ''
        }
    },
    components: {

    },
    methods: {
        queryEntsByName: function(e){

            // 防止form提交出去，触发form的提交操作
            e.preventDefault()
            this.$http.get(`${config.api_url}/enterprises?name=${this.enterprise}`, function(data, status, request){
                if(data)
                    this.show = true
                    this.$set('enterprises', data.data)
            }).error()
        }
    }
}
