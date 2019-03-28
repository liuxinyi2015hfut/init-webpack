let path = require('path');
let webpack = require('webpack');
let merge = require('webpack-merge');
let commonConfig = require('./webpack.config');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let env = process.env.NODE_ENV;
let isTest = env === 'test';
let isDev = env === 'development';

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
			context: ['/**','!**/*.json'],
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
	mode: 'development',
	output: {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, 'build'),
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
							sourceMap: true
						}
					},
					'postcss-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true,
							modifyVars: lessConfig,
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
	devtool: 'eval-source-map',
	// watch:true,
	watchOptions: {
		ignored: /node_modules/
	},
	optimization: {
		nodeEnv: env
	},
	plugins: [
		new CleanWebpackPlugin(['build'], {
			exclude: keepFile
		}),
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		host: '0.0.0.0',
		port: port,
		contentBase: [
			path.resolve(__dirname, './serverJSON'),
			path.resolve(__dirname, '../script')
		],
		hot: true,
		// hotOnly:true,
		inline: true,
		compress: true,
		headers: {'Access-Control-Allow-Origin': '*'},
		useLocalIp: true,
		open: 'Chrome',
		openPage: openPage,
		// https:true,
		stats: {
			colors: true,
		},
		proxy: proxy
	}
});
