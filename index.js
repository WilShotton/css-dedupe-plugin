var _ = require('lodash')
var cssnano = require('cssnano')
var Rx = require('rx')


function DeDeupeCSSPlugin(options) {

    this.options = options
}

DeDeupeCSSPlugin.prototype.apply = function(compiler) {

    var options = this.options

    compiler.plugin('emit', function(compilation, callback) {

        var files = _.filter(compilation.assets, function(value, key) {

            return key.match(/.css$/)
        })

        Rx.Observable.just(files)
            .flatMap(_.identity)
            .map(function(file) {

                return _(file.children)
                    .pluck('_value')
                    .filter(Boolean)
                    .value()
                    .join(' ')
            })
            .flatMap(function(rawStyles) {

                return Rx.Observable
                    .fromPromise(cssnano.process(rawStyles, {safe: true, sourcemap: true}))
                    .map(function(result) {

                        compilation.assets[options.target] = {

                            source: function() {
                                return result.css
                            },

                            size: function() {
                                return result.css.length
                            }
                        }
                    })
            })
            .bufferWithCount(files.length, files.length)
            .subscribe(function() {

                callback()
            })
    })
}

module.exports = DeDeupeCSSPlugin
