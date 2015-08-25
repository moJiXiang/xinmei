export function configRouter (router) {
    router.map({
        '/' : {
            component: require('./src/views/home')
        },
        '/search' : {
            component: require('./src/views/search')
        },
        '/enterprises/:lcid': {
            component: require('./src/views/enterprise')
        },
        '/dashboard': {
            component: require('./src/views/dashboard'),
            subRoutes: {
                '/projects': require('./src/views/projects')
            }
        }
    })

    // router.beforeEach((transition) => {
    //
    //     router.app.email = localStorage.getItem('email')
    //     transition.next()
    // })
}
