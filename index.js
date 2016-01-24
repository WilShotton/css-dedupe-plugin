var _ = require('lodash')
var cssnano = require('cssnano')
var Rx = require('rx')


function CSSDedupePlugin() {}

CSSDedupePlugin.prototype.apply = function(compiler) {

    compiler.plugin('emit', function(compilation, callback) {

        var files = _(compilation.assets)
            .map(function(value, key) {

                return {
                    name: key,
                    value: value
                }
            })
            .filter(function(file) {

                return file.name.match(/.css$/)
            })
            .value()

        Rx.Observable.just(files)
            .flatMap(_.identity)
            .flatMap(function(file) {

                var rawStyles = _(file.value.children)
                    .pluck('_value')
                    .filter(Boolean)
                    .value()
                    .join(' ')

                return Rx.Observable
                    .fromPromise(cssnano.process(rawStyles, {safe: true, sourcemap: true}))
                    .map(function(result) {

                        compilation.assets[file.name] = {

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

module.exports = CSSDedupePlugin
