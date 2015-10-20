require('./style.less')

export default {
    template: require('./template.html'),
    data() {

    },
    components: {

    },
    compiled() {
        this.$root.isDashboard = false
    },
    methods: {
        queryEntsByName(e) {
            e.preventDefault()
            this.$http.get(`${this.$config.api_url}/enterprises?name=${this.enterprise}`, (data, status, request)=> {
                if(data)
                    this.show = true
                    this.$set('enterprises', data.data)
            }).error((data, status, request)=> {

            })
        }
    }
}
