require('./style.less')

export default {
    template: require('./template.html'),
    data: function(){
        return {
        }
    },
    components: {

    },
    compiled: function() {
        this.$root.isDashboard = true
    },
    methods: {

    }
}
