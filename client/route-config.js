export function configRouter (router) {
    router.map({
        '/' : {
            component: require('./src/views/home')
        },
        '/search' : {
            component: require('./src/views/search')
        }
    })

    // router.beforeEach((transition) => {
    //
    //     router.app.email = localStorage.getItem('email')
    //     transition.next()
    // })
}
