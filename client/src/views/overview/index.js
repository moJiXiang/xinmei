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
        console.log('控制台------------------');
        this.$root.isDashboard = true
    },
    methods: {

    }
}
