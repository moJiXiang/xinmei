var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    // entry: {
    //     // index:  ["webpack/hot/dev-server", "./index.js"]
    //     index:  "./index.js"
    //
    // },
    entry: ["webpack/hot/dev-server",'./index.js'],
    output: {
        path: "./build",
        publicPath: "/build/",
        filename: "build.js"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader"
        }, {
            test: /\.html$/,
            loader: "html"
        }, {
            test: /\.(jpg|png|svg)$/,
            loader: "url?limit=8192"
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract("style-loader",
                "css-loader!less-loader")
        }]
    },
    resolve: {
        extensions: ['', '.js', '.json', '.coffee', '.less', '.css']
    },
    plugins: [
        new ExtractTextPlugin("style.css")
    ]
}
