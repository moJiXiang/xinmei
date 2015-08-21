
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

config.entry.unshift('webpack/hot/dev-server');

config.plugins.push(new webpack.HotModuleReplacementPlugin());

var app = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  // noInfo: true,
  historyApiFallback: true,

  proxy: {
    "/api/*": "http://localhost:5000",
    "/session*": "http://localhost:5000",
  }
});

app.listen(9090, '0.0.0.0', function (err, result) {
  console.log('http://localhost:9090');
  if (err) {
    console.log(err);
  }
});
