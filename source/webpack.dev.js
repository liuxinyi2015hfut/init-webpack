let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let commonConfig = require('./webpack.config');
let CleanWebpackPlugin = require('clean-webpack-plugin');

let keepFile = [];


let env = process.env.NODE_ENV;
let isTest=env==='test';
let isDev=env==='development';
let host = 'localhost';
let port = 5555;
let serverPort = 3001;
let testLocation = '127.0.0.1:8080';
let openPage='/index.html';

let proxy=null;
if(isTest){
	proxy=[
		{
			context:['/**'],
			target:`http://${testLocation}`
		}
	];
}else if(isDev){
	proxy=[
		{
			context:['/**'],
			target:`http://${host}:${serverPort}`,
			pathRewrite:(name)=>{
				name=name.split('?')[0].split('/');
				return `/${name[1]}/${name[2]}-${name[3]}.json`
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
		filename: '[name].js',
		// 必须是绝对路径（使用 Node.js 的 path 模块）
		path: path.resolve(__dirname, 'build'),
		//是否在bundle中引入【所包含模块信息】的相关注释
		pathinfo: true
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
				include: path.resolve(__dirname, './src'),
				use: [
					'style-loader',
					{
						loader:'css-loader',
						options:{
							//打包后调试用
							sourceMap:true
						}
					},
					'postcss-loader',
					{
						loader:'less-loader',
						options:{
							//打包后调试用
							sourceMap:true
						}
					}
				]
			},
			{
				test:/\.(eot|svg|woff|woff2|ttf)$/,
				include:path.resolve(__dirname,'./src/common/iconfont'),
				loader:'url-loader'

			},
			{
				test:/\.(jpg|jpeg|png|gif)$/,
				include:path.resolve(__dirname,'./src/common/images'),
				loader:'url-loader'

			},
			{
				test: /\.(mp4|ogg|webm|mp3|wav)$/,
				include: path.resolve(__dirname, './src/common/media'),
				loader: 'file-loader'
			}
		]
	},
	// 用于调试
	devtool:'eval-source-map',
	// // webpack-dev-server 和 webpack-dev-middleware中watch模式默认开启
	// watch:true,
	// 监听文件变化，排除不需要监听的文件夹
	watchOptions:{
		ignored:/node_modules/
	},
	plugins:[
		//在构建之前清理构建文件夹
		new CleanWebpackPlugin(['build'], {
			// 不清楚的子文件
			exclude: keepFile
		}),
		// 模块热替换
		new webpack.HotModuleReplacementPlugin(),
		new webpack.DefinePlugin({
			'process.env':{
				'NODE_ENV':JSON.stringify('development')
			}
		})
	],
	devServer:{
		// 访问IP
		host:host,
		// 监听请求的端口
		port:port,
		// 服务器从哪些目录中提供静态文件
		contentBase:[path.resolve(__dirname,'./serverJSON')],
		// 启用模块热替换， 配合webpack.HotModuleReplacementPlugin使用
		hot:true,
		// // 启用模块热替换而无需页面刷新
		// hotOnly:true,
		//启用内联模式
		inline:true,
		// 一切服务启用gzip压缩
		compress:true,
		//在所有响应中添加首部
		headers:{'Access-Control-Allow-Origin':'*'},
		// 打开浏览器
		open:true,
		//打开浏览器时的页面
		openPage:openPage,
		// // 启用https服务，可配置自签名证书
		// https:true,
		// 精确控制要显示的bundle信息
		stats:{
			//启用控制台的色彩输出
			color:true,
		},
		// 代理api请求
		proxy:proxy,
	}
});