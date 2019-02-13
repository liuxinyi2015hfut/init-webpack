let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let commonConfig = require('./webpack.config');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let env = process.env.NODE_ENV;
let isTest = env === 'test';
let isDev = env === 'development';

// less变量
let lessConfig = require('./less.config');
let openPage = `/index.html`;
let host = 'localhost';
let port = 5555;
let testLocation = '192.168.3.84:8888';
let keepFile = [];

let proxy = null;
if (isTest) {
	proxy = [
		{
			context: ['/**.json'],
			target: `http://${host}:${port}`,
		},
		{
			context: ['/**'],
			target: `http://${testLocation}`
		}
	];
} else if (isDev) {
	proxy = [
		{
			context: ['/dev/**'],
			target: `http://${host}:${port}`,
			pathRewrite: (urlName) => {
				let name = urlName.split('?')[0].split('/');
				if (/\.\w+$/.test(name[name.length - 1])) {
					return urlName.slice(4)
				}
				let devName = name.slice(2).reduce((pre, next) => {
					if (pre) {
						pre += '-';
					}
					pre += next;
					return pre
				}, '');
				return `/${devName}.json`
			}
		}
	]
}


module.exports = merge(commonConfig, {
	// 选择模式告诉webpack可以相应地使用它的内置优化
	//开发环境，启用如下
	// NamedChunksPlugin
	// NamedModulesPlugin。
	mode: 'development',
	output: {
		// 「入口分块(entry chunk)」的文件名模板
		filename: 'js/[name].js',
		// 必须是绝对路径（使用 Node.js 的 path 模块）
		path: path.resolve(__dirname, 'build'),
		//是否在bundle中引入【所包含模块信息】的相关注释
		// pathinfo: true
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.less$/,
				// include: path.resolve(__dirname, './src'),
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							//打包后调试用
							sourceMap: true
						}
					},
					'postcss-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							// 更换less变量
							modifyVars: lessConfig,
							//打包后调试用
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(eot|svg|woff|woff2|ttf|otf)$/,
				include: path.resolve(__dirname, './src/common/iconfont'),
				loader: 'url-loader'

			},
			{
				test: /\.(jpg|jpeg|png|gif)$/,
				include: path.resolve(__dirname, './src/common/images'),
				loader: 'url-loader'

			},
			{
				test: /\.(mp4|ogg|webm|mp3|wav)$/,
				include: path.resolve(__dirname, './src/common/media'),
				loader: 'file-loader'
			}
		]
	},
	// 用于调试
	devtool: 'eval-source-map',
	// // webpack-dev-server 和 webpack-dev-middleware中watch模式默认开启
	// watch:true,
	// 监听文件变化，排除不需要监听的文件夹
	watchOptions: {
		ignored: /node_modules/
	},
	optimization: {
		//指定环境变量process.env.NODE_ENV，一些library根据环境变量优化代码
		nodeEnv: env
	},
	plugins: [
		//在构建之前清理构建文件夹
		new CleanWebpackPlugin(['build'], {
			// 不清楚的子文件
			exclude: keepFile
		}),
		// 模块热替换
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		// 访问IP
		host: '0.0.0.0',
		// 监听请求的端口
		port: port,
		// 服务器从哪些目录中提供静态文件
		contentBase: [
			//开发接口假数据文件夹
			path.resolve(__dirname, './serverJSON'),
			//生产环境线上静态文件存放文件夹
			path.resolve(__dirname, '../script')
		],
		// 启用模块热替换， 配合webpack.HotModuleReplacementPlugin使用
		hot: true,
		// // 启用模块热替换而无需页面刷新
		// hotOnly:true,
		//启用内联模式
		inline: true,
		// 一切服务启用gzip压缩
		compress: true,
		//在所有响应中添加首部
		headers: {'Access-Control-Allow-Origin': '*'},
		//允许浏览器使用本地IP打开网页
		useLocalIp: true,
		// 打开浏览器
		open: 'Chrome',
		//打开浏览器时的页面
		openPage: openPage,
		// // 启用https服务，可配置自签名证书
		// https:true,
		// 精确控制要显示的bundle信息
		stats: {
			//启用控制台的色彩输出
			colors: true,
		},
		// 代理api请求
		proxy: proxy
	}
});