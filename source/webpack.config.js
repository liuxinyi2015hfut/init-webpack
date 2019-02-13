let path = require('path');
//webpack 4.0 不需要json-loader

let HtmlWebpackPlugin = require('html-webpack-plugin');
let HappyPack = require('happypack');


//模板生成HTML文件
let pages = [
	{
		title: '示例',
		chunks: ['index'],
		filename: 'index.html'
	}
].map(item => {
	let itemVendor = item.chunks.map(ite => 'vendor-' + ite);
	return (
		new HtmlWebpackPlugin({
			templateParameters: {
				title: item.title
			},
			template: './htmlTemplate.ejs',
			chunks: [...item.chunks, ...itemVendor, 'common', 'vendorCommon', 'runtime'],
			filename: item.filename
		})
	)
});

module.exports = {
	// 设置webpack编译用于什么环境，默认web，可省略
	target: 'web',
	entry: {
		index: './src/pages/index.js'
	},
	output: {
		// //导出库的名称
		// library:['MyLibrary','[name]' ],
		// //配置如何暴露导出库
		// 	//暴露为通用模块定义下都可以运行
		// libraryTarget:'umd'
	},
	//bundle中排除的外部依赖
	externals: {
		// //import $ from 'jquery';
		// jquery:'jQuery',
		// echarts:'echarts'
	},
	module: {
		// //不解析匹配到的模块
		// noParse:[],
		rules: [
			// - 只在 test 和 文件名匹配 中使用正则表达式
			// - 在 include 和 exclude 中使用绝对路径数组
			// - 尽量避免 exclude，更倾向于使用 include
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, './src')],
				loader: 'babel-loader',
				options: {
					//将转译结果缓存到文件系统中，加快babel转译速度
					cacheDirectory: true
				}
			}
			// {
			// 	test: /\.ejs$/,
			// 	include:path.resolve(__dirname,'./src/template'),
			// 	loader: "ejs-loader?variable=data"
			// }
		]
	},
	//优化配置
	optimization: {
		//将包含chunks映射关系的list单独提取出来，解决因为chunk的id变化导致文件缓存失效的问题
		runtimeChunk: "single",

	},
	resolve: {
		//使用绝对路径导入模块时，只在设定的目录中搜索
		modules: [path.resolve(__dirname, './node_modules')],
		// //设置导入路径别名
		// alias: {
		// 	'@': path.resolve(__dirname, './src')
		// },
		//自动解析确定的扩展，能够使用户在引入特定类型模块时不带扩展名
		extensions: ['.js'],
		symlinks: false
	},
	plugins: [
		...pages
	],
}

