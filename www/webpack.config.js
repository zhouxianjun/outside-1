/**
 * Created by alone on 17-5-11.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './app/main.js',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    less: ExtractTextPlugin.extract({
                        use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                        fallback: 'vue-style-loader'
                    }),
                    css: ExtractTextPlugin.extract({
                        use: ['css-loader', 'autoprefixer-loader', 'less-loader'],
                        fallback: 'vue-style-loader'
                    })
                }
            }
        }, {
            test: /iview\/.*?js$/,
            loader: 'babel-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader?minimize', 'autoprefixer-loader'],
                fallback: 'style-loader'
            })
        }, {
            test: /\.less/,
            use: ExtractTextPlugin.extract({
                use: ['autoprefixer-loader', 'less-loader'],
                fallback: 'style-loader'
            })
        }, {
            test: /\.(woff|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=1024&name=fonts/[name]-[sha512:hash:base64:7].[ext]'
        }, {
            test: /\.(gif|jpg|png|svg)\??.*$/,
            loader: 'url-loader?limit=1024&name=img/[name]-[sha512:hash:base64:7].[ext]'
        }, {
            test: /\.(swf)$/,
            loader: 'file-loader?name=swf/[name]-[sha512:hash:base64:7].[ext]'
        }, {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'datatables': 'admin-lte/plugins/datatables/jquery.dataTables.min'
        }
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            filename: '../public/index.html',
            template: './index.ejs',
            inject: false
        }),
        new webpack.ProvidePlugin({$: "jquery", jQuery: 'jquery', DataTable: 'datatables'})
    ]
};