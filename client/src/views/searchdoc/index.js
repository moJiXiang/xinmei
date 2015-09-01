require('./style.less')

export default {
    template: require('./template.html'),
    data: function(){
        return {
            kw: null,
            searchdocs: [],
            showModal: false,
            modalContent: null
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
        },
        show: function(content) {
            console.log(content);
            this.showModal = true
            this.modalContent = content
        }
    },
    route: {
        data ({to: {params: {kw}}}) {
            this.kw = kw
            this.update()
        }
    }
}
