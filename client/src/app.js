require('./app.less')
export default {
    template: require('./app.html'),
    data: function() {
        return {

        }
    },
    components: {
        'app-header': function(resolve) {
            require(['./components/header'], resolve)
        },
        'app-footer': function(resolve) {
            require(['./components/footer'], resolve)
        }
    },
    compiled: function(){
        console.log('test')
    }
}
