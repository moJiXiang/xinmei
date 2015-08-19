require('./style.less')

export default {
    template: require('./template.html'),
    replace: true,
    data: function() {
        return {
            user: {
                email: 'null'
            }
        }
    },
    components: {

    },
    route: {
        activate() {
            return new Promise((resolve) => {
                // this.user.email = localStorage.getItem('email')
                resolve()
            })
        },
        data({to, next}) {
            next({
                user: {
                    email: localStorage.getItem('email')
                }
            })
        }
    }
}
