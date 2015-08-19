require('./style.less')

export default {
    template: require('./template.html'),
    props: ['params'],
    data: function(){
        return {
            params: null
        }
    },
    compiled: function() {
        console.log(`this.params, ${this.params}`)
        this.params = localStorage.getItem('email')
    }
}
