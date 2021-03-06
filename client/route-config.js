export function configRouter (router) {
    router.map({
        '/' : {
            component: require('./src/views/home')
        },
        '/search' : {
            component: require('./src/views/search')
        },
        '/industrychart/:lcid': {
            component: require('./src/views/industry')
        },
        '/tree/:lcid': {
            component: require('./src/views/tree')
        },
        '/dashboard': {
            component: require('./src/views/dashboard'),
            subRoutes: {
                '/overview': {component: require('./src/views/overview')},
                '/projects': {component: require('./src/views/projects')},
                '/future': {component: require('./src/views/future')}
            }
        },
        '/searchdocs/:kw': {
            component: require('./src/views/searchdoc')
        }
    })

    router.beforeEach((transition) => {
        if (transition.to.path === '/forbidden')     {
            router.app.showLogin = true
            router.go('/')
        }else {
            transition.next()
        }
    })
}
