const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

function resolve(dir) {
    return path.resolve(__dirname, '..', dir)
}

module.exports = {
    mode: 'production',
    entry: {
        app: resolve('src/app.js'),
        layout: resolve('src/js/layout.js'),
    },
    output: {
        path: resolve('dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js'
    },
    module: {
        rules: [{
            test: /\.html$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }, {
                loader: "extract-loader",
            }, {
                loader: "html-loader",
                options: {
                    attrs: ['data-src', 'link:href']
                }
            }]
        }, {
            test: /\.scss$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: 'css/[name].css'
                }
            }, {
                loader: "extract-loader"
            }, {
                loader: "css-loader",
                options: {
                    importLoaders: 1
                }
            }, {
                loader: "postcss-loader",
                options: {
                    ident: 'postcss',
                    plugins: [
                        require('autoprefixer')(),
                        require('cssnano')()
                    ]
                }
            }, {
                loader: "sass-loader"
            }]
        }, {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: [ {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                }
            }, {
                loader: "eslint-loader",
            }]
        }, {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    publicPath: '../images',
                    outputPath: 'images',
                    name: '[name].[ext]'
                }
            }, {
                loader: "img-loader",
                options: {
                    plugins: [
                        require('imagemin-gifsicle')({
                            interlaced: false
                        }),
                        require('imagemin-mozjpeg')({
                            progressive: true,
                            arithmetic: false
                        }),
                        require('imagemin-pngquant')({
                            floyd: 0.5,
                            speed: 11,
                            quality: [0.6, 0.6]
                        }),
                        require('imagemin-svgo')({
                            plugins: [
                                { removeTitle: true },
                                { convertPathData: false }
                            ]
                        })
                    ]
                }
            }]
        }]
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/libs', to: 'libs' },
        ])
    ]
}