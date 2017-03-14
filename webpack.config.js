const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'dist/index': './index.js'
    },
    output: {
        path: './',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        // avoid webpack trying to shim process
        noParse: [/es6-promise\.js$/],
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            // excluding sonpme local linked packages.
            // for normal use cases only node_modules is needed
            exclude: /static|data|node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
                'autoprefixer-loader'
            ]
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=10000&name=img/[name].[ext]'
        },{
            test: /\.(png|jpg)$/,
            loader: 'file-loader'
        }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
} else {
    module.exports.devtool = '#source-map'
}