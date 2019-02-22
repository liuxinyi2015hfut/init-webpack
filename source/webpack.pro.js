let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let commonConfig = require('./webpack.config');
let MiniCssExtract = require('mini-css-extract-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let lessConfig = require('./less.config');
let domain = '/';
let keepFile = ['JSON'];

module.exports = merge(commonConfig, {
	mode: 'production',
	output: {
		filename: 'js/[name].[chunkhash:8].js',
		path: path.resolve(__dirname, '../script'),
		publicPath: domain,
		pathinfo: false,
		chunkFilename: 'js/[name].[chunkhash:8].js'
	},
	module: {
		rules: [
			{
				test: /\.(less|css)$/,
				use: [
					MiniCssExtract.loader,
					'css-loader',
					'postcss-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							// 更换less变量
							modifyVars: lessConfig,
						}
					}
				]
			},
			{
				test: /\.(eot|svg|woff|woff2|ttf|otf)$/,
				include: path.resolve(__dirname, './src/common/iconfont'),
				loader: 'url-loader',
				options: {
					limit: 8192,
					outputPath: 'iconfont/',
					name: '[name].[hash:8].[ext]'
				}
			},
			{
				test: /\.(jpg|jpeg|png|gif)$/,
				include: path.resolve(__dirname, './src/common/images'),
				loader: 'url-loader',
				options: {
					limit: 8192,
					outputPath: 'images/',
					name: '[name].[hash:8].[ext]'
				}
			},
			{
				test: /\.(mp4|ogg|webm|mp3|wav)$/,
				include: path.resolve(__dirname, './src/common/media'),
				loader: 'file-loader',
				options: {
					outputPath: 'media/',
					name: '[name].[hash:8].[ext]'
				}
			}
		]
	},
	//优化配置
	optimization: {
		nodeEnv: 'production',
		mangleWasmImports: true,
		removeEmptyChunks: true,
		removeAvailableModules: true,
		splitChunks: {
			cacheGroups: {
				common: {
					chunks: 'all',
					test: /[\\/src[\\/]/,
					name: "common",
					minChunks: 2,
					priority: -20,
					minSize: 0,
					maxInitialRequests: 5,
					reuseExistingChunk: true

				},
				vendorCommon: {
					chunks: 'all',
					test: /[\\/]node_modules[\\/]/,
					name: 'vendorCommon',
					minChunks: 2,
					priority: -10,
					minSize: 0,
					enforce: true
				},
				vendor: {
					chunks: 'all',
					test: /[\\/]node_modules[\\/]/,
					automaticNameDelimiter: '-',
					minChunks: 1,
					priority: -15,
					minSize: 0,
					enforce: true
				}
			}
		}
	},
	plugins: [
		new CleanWebpackPlugin(['../script/'], {
			allowExternal: true,
			exclude: keepFile
		}),
		new MiniCssExtract({filename: 'css/[name].[contenthash:8].css'}),
		new OptimizeCSSAssetsPlugin(),
		new BundleAnalyzerPlugin({
			analyzerHost: 'localhost',
			analyzerPort: 4321,
			analyzerMode: 'static',
			reportFilename: 'js/report.html'
		})
	]
})
