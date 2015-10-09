require('./style.less')

export default {
    template: require('./template.html'),
    data() {
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
    compiled() {
        this.$root.isDashboard = false
        this.getExitWords()
        this.getSearchwords()
    },
    methods: {
        getEntsList() {
            this.$http.get(`${this.$config.api_url}/enterprises`, (data, status, request)=> {
                this.$set('enterprises', data.data)
            }).error((data, status, request)=> {

            })
        },
        tabEnterprise(lcid) {
            this.$http.get(`${this.$config.api_url}/enterprises/${lcid}`, (data, status, request)=> {
                this.$set('example', data.data)
            }).error((data, status, request)=> {

            })
        },
        startProject(entname) {
            this.$http.get(`${this.$config.api_url}/grabentlist?entname=${entname}`, (data, status, request)=> {

            })
        },
        queryEntsByName(e) {
            e.preventDefault()
            this.$http.get(`${this.$config.api_url}/enterprises?name=${this.enterprisename}`, (data, status, request)=> {
                this.$set('enterprises', data.data)
            }).error((data, status, request)=> {

            })
        },
        queryEntsFromQy(e) {
            e.preventDefault()
            let self = this
            self.$http.get(`${this.$config.api_url}/searchqy?entname=${self.entname}`, (data, status, request)=> {
                console.log(data);
                var results = data.data
                for (var ent of results) {
                    console.log(ent);
                    ent.downloading = false
                }
                console.log(self.qySearchResults);
                self.qySearchResults=results
            }).error((data, status, request)=> {

            })
        },
        grabqy(ent) {
            let lcid = ent.lcid
            let self = this
            self.$http.get(`${this.$config.api_url}/grab/${lcid}`, (data, status, request)=> {
                ent.downloading = true
            }).error((data, status, request)=> {

            })
        },
        addToDownloadList(entname, lcid) {
            obj = {
                entname: entname,
                lcid: lcid
            }
            this.downloadlist.push(obj)
        },
        sendTasks() {
            this.$http.post(`${this.$config.api_url}/grab`, {downloadlist: this.downloadlist}, (data, status, request)=> {

            }).error((data, status, request)=> {

            })
        },
        // 增加词团的关键词
        addKeyWords(e) {
            e.preventDefault()
            this.$http.post(`${this.$config.api_url}/words`, this.newwords, (data)=> {
                console.log(data)
                this.exitwords.push(data.data)
            })
        },
        // 修改词团的主题部分
        modifyWords(word) {
            this.currentWord = word
        },
        addWord(e) {
            e.preventDefault()
            console.log(this.currentWord);
            this.currentWord.words.push(this.newword)
            this.$http.put(`${this.$config.api_url}/words/${this.currentWord._id.$oid}`, this.currentWord, (data)=> {
                // this.exitwords = data.data
            })
        },
        // 获取数据库中的词团
        getExitWords(e) {
            this.$http.get(`${this.$config.api_url}/words`, (data)=> {
                this.exitwords = data.data
            })
        },

        addSearchWord(e) {
            e.preventDefault()
            this.$http.post(`${this.$config.api_url}/searchwords`, this.searchword, (data)=> {
                this.searchwords.push(data.data)
            })
        },

        selectWord() {
            var keyword = this.searchword.keyword
            this.$http.get(`${this.$config.api_url}/words?keyword=${keyword}`, (data)=> {
                this.words = data.data[0].words
            })
        },

        getSearchwords() {
            this.$http.get(`${this.$config.api_url}/searchwords`, (data)=> {
                this.searchwords = data.data
            })
        }
    }
}
