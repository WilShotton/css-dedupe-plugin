
var CSSDedupePlugin = require('./index')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('html-webpack-plugin')
var path = require('path')
var webpack = require('webpack')


var ROOT_PATH = path.resolve(__dirname)

var htmlPlugin = new HtmlPlugin({
    title: 'Component builder'
})

var extractCSS = new ExtractTextPlugin('styles.css', {
    allChunks: true
})

var cssDedupePlugin = new CSSDedupePlugin()

module.exports = {

    entry: [
        path.resolve(ROOT_PATH, 'fixture/main.jsx')
    ],

    output: {
        path: 'build',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader',
                include: path.resolve(ROOT_PATH, 'fixture'),
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react'],
                    plugins: ['transform-class-properties']
                }
            }, {
                test: /.scss$/,
                loader: extractCSS.extract('style', 'css!postcss!sass')
            }
        ]
    },

    sassLoader: {
        precision: 10
    },

    postcss: [
        require('autoprefixer-core'),
        require('postcss-discard-duplicates')
    ],

    plugins: [htmlPlugin, extractCSS, cssDedupePlugin],

    devtool: 'source-map'
}
