require('./style.less')

export default {
    template: require('./template.html'),
    data: function(){
        return {
            enterprisename: null,
            enterprises: null,
            example: null,
            qySearchResults: null,
            downloadlist: [],
            newwords : {
                keyword: null,
                words: []
            },
            currentWord: null,
            exitwords: [],
            newword: null,
            searchword: {
                main: null,
                keyword: null,
                word: null
            },
            searchwords: [],
            words: null
        }
    },
    components: {

    },
    compiled: function() {
        this.$root.isDashboard = false
        this.getExitWords()
        this.getSearchwords()
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
        },
        // 增加词团的关键词
        addKeyWords: function(e) {
            e.preventDefault()
            this.$http.post(`${this.$root.config.api_url}/words`, this.newwords, function(data) {
                console.log(data)
                this.exitwords.push(data.data)
            })
        },
        // 修改词团的主题部分
        modifyWords: function(word) {
            this.currentWord = word
        },
        addWord: function(e) {
            e.preventDefault()
            console.log(this.currentWord);
            this.currentWord.words.push(this.newword)
            this.$http.put(`${this.$root.config.api_url}/words/${this.currentWord._id.$oid}`, this.currentWord, function(data) {
                // this.exitwords = data.data
            })
        },
        // 获取数据库中的词团
        getExitWords: function(e) {
            this.$http.get(`${this.$root.config.api_url}/words`, function(data) {
                this.exitwords = data.data
            })
        },

        addSearchWord: function(e) {
            e.preventDefault()
            console.log(this.searchword)
            this.$http.post(`${this.$root.config.api_url}/searchwords`, this.searchword, function(data) {
                this.searchwords.push(data.data)
            })
        },

        selectWord: function() {
            console.log('---------------');
            console.log(this.searchword);
            var keyword = this.searchword.keyword
            this.$http.get(`${this.$root.config.api_url}/words?keyword=${keyword}`, function(data) {
                this.words = data.data[0].words
            })
        },

        getSearchwords: function() {
            this.$http.get(`${this.$root.config.api_url}/searchwords`, function(data) {
                this.searchwords = data.data
            })
        }
    }
}
