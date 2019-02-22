let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

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
	target: 'web',
	entry: {
		index: './src/pages/index.js'
	},
	output: {
		// library:['MyLibrary','[name]' ],
		// libraryTarget:'umd'
	},
	externals: {
		// jquery:'jQuery',
		// echarts:'echarts'
	},
	module: {
		// noParse:[],
		rules: [
			{
				test: /\.js$/,
				include: [path.resolve(__dirname, './src')],
				loader: 'babel-loader',
				options: {
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
	optimization: {
		runtimeChunk: "single",

	},
	resolve: {
		modules: [path.resolve(__dirname, './node_modules')],
		// alias: {
		// 	'@': path.resolve(__dirname, './src')
		// },
		extensions: ['.js'],
		symlinks: false
	},
	plugins: [
		...pages
	],
}

