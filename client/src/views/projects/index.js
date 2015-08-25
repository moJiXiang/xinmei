require('./style.less')

export default {
    template: require('./template.html'),
    data: function(){
        return {
            enterprisename: null,
            enterprises: null,
            example: null,
            qySearchResults: null,
            downloadlist: []
        }
    },
    components: {

    },
    compiled: function() {
        this.$root.isDashboard = false
    },
    methods: {
        getEntsList: function() {
            this.$http.get(`${this.$root.config.api_url}/enterprises`, function(data, status, request) {
                this.$set('enterprises', data.data)
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data, status, request) {

            })
        },
        tabEnterprise: function(lcid) {
            this.$http.get(`${this.$root.config.api_url}/enterprises/${lcid}`, function(data, status, request) {
                this.$set('example', data.data)
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data, status, request) {

            })
        },
        startProject: function(entname) {
            this.$http.get(`${this.$root.config.api_url}/grabentlist?entname=${entname}`, function(data, status, request) {

            })
        },
        queryEntsByName: function(e) {
            e.preventDefault()
            this.$http.get(`${this.$root.config.api_url}/enterprises?name=${this.enterprisename}`, function(data, status, request) {
                this.$set('enterprises', data.data)
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data, status, request) {

            })
        },
        queryEntsFromQy: function(e) {
            e.preventDefault()
            let self = this
            self.$http.get(`${this.$root.config.api_url}/searchqy?entname=${self.entname}`, function(data, status, request) {
                console.log(data);
                var results = data.data
                for (var ent of results) {
                    console.log(ent);
                    ent.downloading = false
                }
                console.log(self.qySearchResults);
                self.qySearchResults=results
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data, status, request) {

            })
        },
        grabqy: function(ent) {
            let lcid = ent.lcid
            let self = this
            self.$http.get(`${this.$root.config.api_url}/grab/${lcid}`, function(data, status, request) {
                ent.downloading = true
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data, status, request) {

            })
        },
        addToDownloadList: function(entname, lcid) {
            obj = {
                entname: entname,
                lcid: lcid
            }
            this.downloadlist.push(obj)
        },
        sendTasks: function() {
            this.$http.post(`${this.$root.config.api_url}/grab`, {downloadlist: this.downloadlist}, function(data, status, request) {

            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }).error(function(data, status, request) {

            })
        }
    }
}
