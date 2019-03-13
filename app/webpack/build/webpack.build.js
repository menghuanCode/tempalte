const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./config')

let buildConfig = {
    mode: 'production',
    plugins: [
        new CleanWebpackPlugin()
    ]
}

module.exports = merge(baseConfig, buildConfig)