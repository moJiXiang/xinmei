export function configRouter (router) {
    router.map({
        '/' : {
            component: require('./src/views/home')
        },
        '/search' : {
            component: require('./src/views/search')
        },
        '/tree/:lcid': {
            component: require('./src/views/tree')
        },
        '/industrychart/:lcid': {
            component: require('./src/views/industry')
        },
        '/dashboard': {
            component: require('./src/views/dashboard'),
            subRoutes: {
                '/overview': {component: require('./src/views/overview')},
                '/projects': {component: require('./src/views/projects')},
                '/future': {component: require('./src/views/future')}
            }
        }
    })

    router.beforeEach((transition) => {
        console.log(transition);
        if (transition.to.path === '/forbidden')     {
            router.app.showLogin = true
            router.go('/')
        }else {
            transition.next()
        }
    })
}
