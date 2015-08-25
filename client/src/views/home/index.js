require('./style.less')

export default {
    template: require('./template.html'),
    data: function(){
        return {
            enterprise: ''
        }
    },
    components: {

    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {

    }
}
