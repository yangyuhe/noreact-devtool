const path =require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let config={
    mode:"development",
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
    entry:{
        page1:path.resolve(__dirname,"src/home.tsx")
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js','.ts',".tsx"],
        modules:[path.resolve(__dirname,'node_modules')]
    },
    module: {
        rules: [{
            test:/\.js/,
            use:["source-map-loader"]
        }]
    },
    devServer:{
        hot:true
    },
    plugins:[new HtmlWebpackPlugin()]
};

module.exports=(env,argv)=>{
    if(argv.mode=="production"){
        config.mode=argv.mode;
    }
    let webTarget=webpackMerge(config,{
        target:"web",
        output:{
            path:path.resolve(__dirname,"dist/web")
        },
        module: {
            rules: [{
                test:/\.scss$/,
                use:[{
                    loader:MiniCssExtractPlugin.loader,
                    options:{
                        hmr:config.mode=="production"?false:true
                    }
                },"css-loader","resolve-url-loader",{
                    loader:"sass-loader",
                    options: {
                        sourceMap: true,
                        sourceMapContents: false
                    }
                }]
            },{
                test:/\.(png|jpeg|gif|eot|woff2|ttf|woff|svg)$/,
                use:["file-loader"]
            },{
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader"
                }]
            }]
        },
        plugins:[new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        })]
    });
    let nodeTarget=webpackMerge(config,{
        target:"node",
        output:{
            path:path.resolve(__dirname,"dist/node"),
            libraryTarget:"commonjs2"
        },
        module: {
            rules: [{
                test:/\.scss$/,
                use:["null-loader"]
            },{
                test:/\.(png|jpeg|gif|eot|woff2|ttf|woff|svg)$/,
                use:["null-loader"]
            },{
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options:{
                        compilerOptions:{
                            target:"ES2015"
                        }
                    }
                }]
            }]
        }
    });
    return [nodeTarget,webTarget];
};