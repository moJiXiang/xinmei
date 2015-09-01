require('./style.less')
export default {
    template: require('./template.html'),
    props: ['show', 'content'],
    compile: function() {
        console.log('show modal');
    }
}
