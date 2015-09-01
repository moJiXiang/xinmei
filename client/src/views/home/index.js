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
        console.log('首页－－－－－－－－－－－－－－－－－');
        this.$root.isDashboard = false
    },
    methods: {

    }
}
