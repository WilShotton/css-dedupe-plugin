
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlPlugin = require('html-webpack-plugin')
var path = require('path')
var webpack = require('webpack')

var DeDupeCSSPlugin = require('./dedupe-css-plugin')

//var cl = require('concat-loader')


var ROOT_PATH = path.resolve(__dirname)

var htmlPlugin = new HtmlPlugin({
    title: 'Component builder'
})

var extractCSS = new ExtractTextPlugin('styles.css', {
    allChunks: true
})

var deDupeCSSPlugin = new DeDupeCSSPlugin({target: 'styles.css'})

module.exports = {

    entry: [
        path.resolve(ROOT_PATH, 'src/main.jsx')
    ],

    output: {
        path: 'build',
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.di$/,
                loader: 'context-loader'
            }, {
                test: /\.html$/,
                loader: 'html-loader'
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.jsx$/,
                loader: 'babel-loader',
                include: path.resolve(ROOT_PATH, 'src'),
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

    plugins: [htmlPlugin, extractCSS, deDupeCSSPlugin],

    devtool: 'source-map',

    devServer: {
        colors: true,
        contentBase: './build',
        https: false,
        host: '0.0.0.0',
        port: 8888,
        filename: 'main.js',
        hot: false,
        progress: true,
        stats: {
            cached: false,
            cachedAssets:false,
            colors: true
        }
    }
}
