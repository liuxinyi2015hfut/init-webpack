let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let commonConfig = require('./webpack.config');
let MiniCssExtract = require('mini-css-extract-plugin');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let UglifyJsPlugin = require('uglifyjs-webpack-plugin');
let OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let lessConfig = require('./less.config');
let domain = '/';
let keepFile = ['JSON'];

module.exports = merge(commonConfig, {
	// 选择模式告诉webpack可以相应地使用它的内置优化
	//生产环境，启用如下
	// FlagDependencyUsagePlugin,
	// FlagIncludedChunksPlugin,
	// ModuleConcatenationPlugin,
	// NoEmitOnErrorsPlugin,
	// OccurrenceOrderPlugin,
	// SideEffectsFlagPlugin
	// UglifyJsPlugin——删除未引用代码，并压缩JS
	mode: 'production',
	output: {
		// 「入口分块(entry chunk)」的文件名模板,chunkhash用于长效缓存
		filename: 'js/[name].[chunkhash:8].js',
		// 所有输出文件的目标路径，必须是绝对路径（使用 Node.js 的 path 模块）
		path: path.resolve(__dirname, '../script'),
		// 输出解析文件的目录，url 相对于 HTML 页面
		publicPath: domain,
		//是否在bundle中引入【所包含模块信息】的相关注释
		pathinfo: false,
		//非入口chunk文件名,chunkhash用于长效缓存
		chunkFilename: 'js/[name].[chunkhash:8].js'
	},
	module: {
		rules: [
			{
				test: /\.(less|css)$/,
				use: [
					// webpack4.0 分离样式生产单独css文件
					MiniCssExtract.loader,
					'css-loader',
					// 自动添加浏览器兼容性前缀
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
					// 8KB以内的图片转Base64
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
					// 8KB以内的图片转Base64
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
					// [文件名].[hash值].[格式后缀]
					name: '[name].[hash:8].[ext]'
				}
			}
		]
	},
	//优化配置
	optimization: {
		//指定环境变量process.env.NODE_ENV，一些library根据环境变量优化代码
		nodeEnv: 'production',
		mangleWasmImports: true,
		//处理压缩
		minimizer: [
			// 删除未引用代码，并压缩JS
			new UglifyJsPlugin({
				uglifyOptions: {
					cache: true,
					parallel: true
				}
			}),
			// 压缩CSS代码
			new OptimizeCSSAssetsPlugin()
		],
		//监测和删除空模块
		removeEmptyChunks: true,
		//监测和删除父模块中已包含的模块
		removeAvailableModules: true,
		//提取重复模块
		splitChunks: {
			cacheGroups: {
				//项目公共组件，代码提取
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
				//公共第三方组件，代码提取
				vendorCommon: {
					chunks: 'all',
					test: /[\\/]node_modules[\\/]/,
					name: 'vendorCommon',
					minChunks: 2,
					priority: -10,
					minSize: 0,
					enforce: true
				},
				//独立第三方组件，代码提取
				vendor: {
					chunks: 'all',
					test: /[\\/]node_modules[\\/]/,
					//块名称的连接符
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
		//在构建之前清理构建文件夹
		new CleanWebpackPlugin(['../script/'], {
			//允许清楚webpack根目录之外的文件夹
			allowExternal: true,
			// 不清楚的子文件
			exclude: keepFile
		}),
		new MiniCssExtract({filename: 'css/[name].[contenthash:8].css'}),
		//webpack打包输出文件可视化
		new BundleAnalyzerPlugin({
			analyzerHost: 'localhost',
			analyzerPort: 4321,
			analyzerMode: 'static',
			reportFilename: 'js/report.html'
		})
	]
})
