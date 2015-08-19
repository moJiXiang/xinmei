export function configRouter (router) {
    router.map({
        '/' : {
            component: require('./src/views/home')
        },
        '/login': {
            component: require('./src/views/login')
        },
        '/regist': {
            component: require('./src/views/regist')
        }
    })

    // router.beforeEach((transition) => {
    //
    //     router.app.email = localStorage.getItem('email')
    //     transition.next()
    // })
}
