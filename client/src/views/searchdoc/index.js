require('./style.less')

export default {
    template: require('./template.html'),
    data: function(){
        return {
            kw: null,
            searchdocs: []
        }
    },
    components: {

    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {
        update: function () {
            this.$http.get(`${this.$root.config.api_url}/searchdocs/${this.kw}`, function (data) {
                this.searchdocs = data.data
            })
        }
    },
    route: {
        data ({to: {params: {kw}}}) {
            this.kw = kw
            this.update()
        }
    }
}
