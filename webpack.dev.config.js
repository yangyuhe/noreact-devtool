const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let config = {
    mode: 'development',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    entry: {
        main: path.resolve(__dirname, 'src/index.tsx')
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js/,
                use: ['source-map-loader'],
                enforce: 'pre'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sourceMapContents: false
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'resolve-url-loader']
            },
            {
                test: /\.(png|jpeg|gif|eot|woff2|ttf|woff|svg)$/,
                use: ['file-loader']
            }
        ]
    },
    devServer: {
        hot: true
    },
    plugins: [new HtmlWebpackPlugin()]
};

module.exports = config;
