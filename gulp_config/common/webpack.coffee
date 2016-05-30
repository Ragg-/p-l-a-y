webpack = require "webpack"
option  = require "./gulp.coffee"

module.exports =
    watchDelay  : 500

    output      :
        filename            : "[name].js"
        sourceMapFilename   : "map/[file].map"
        publicPath          : "/js/"

    devtool     : "#source-map"

    target      : "atom"

    resolve     :
        root            : [
            "#{option.sourceDir}/renderer/scripts"
        ]
        extensions      : ["", ".js"]
        modulesDirectories  : [
            "bower_components"
            "node_modules"
        ]
        alias               :
            bower   : "bower_components"

    module                  :
        loaders     : [
            {
                test: /\.jade$/,
                loader: "jade-loader",
            }
            {
                test: /\.styl$/,
                loader: "css-loader!stylus-loader",
            }
            {
                test: /\.js$/,
                loader: "babel",
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ["stage-3"]
                    plugins: [
                        "transform-es2015-arrow-functions"
                        "transform-es2015-block-scoped-functions"
                        "transform-es2015-block-scoping"
                        "transform-es2015-classes"
                        "transform-es2015-computed-properties"
                        "transform-es2015-destructuring"
                        "transform-es2015-for-of"
                        "transform-es2015-function-name"
                        "transform-es2015-literals"
                        "transform-es2015-modules-commonjs"
                        "transform-es2015-object-super"
                        "transform-es2015-parameters"
                        "transform-es2015-shorthand-properties"
                        "transform-es2015-spread"
                        "transform-es2015-sticky-regex"
                        "transform-es2015-template-literals"
                        "transform-es2015-typeof-symbol"
                        "transform-es2015-unicode-regex"
                        "add-module-exports"
                    ]
                }
            }
        ]

    plugins         : [
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("package.json", [ "main" ]))
        new webpack.ResolverPlugin(new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", [ "main" ]))
        new webpack.optimize.AggressiveMergingPlugin
        new webpack.optimize.DedupePlugin
    ]
