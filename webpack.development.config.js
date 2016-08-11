/*----------------------------------------------------------
Settings
----------------------------------------------------------*/

// Main
var webpack = require("webpack");
var path = require('path');

/*----------------------------------------------------------
Setup
----------------------------------------------------------*/

module.exports = {

  // // Create Sourcemaps for the bundle
  devtool: 'cheap-module-source-map',

	entry: [
		'index',
	],

	output: {
		path: path.join(__dirname, 'public'),
		filename: "[name].js"
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx$/,
				exclude: /(node_modules|vendor)/,
				loader: "eslint-loader"
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|vendor)/,
				loader: "eslint-loader"
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				loaders: ['babel'],
				exclude: /(node_modules|vendor)/
			},
			{
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			}
		]
	},

	eslint: {
		quiet: false
	},

	resolve: {
		root: [
			path.join(__dirname, 'assets'),
		],
		extensions: ['', '.js', '.html', '.jsx']
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"DEVELOPMENT"'
			}
		}),
		// Avoid publishing files when compilation failed
		new webpack.NoErrorsPlugin(),
	],

	stats: {
		// Nice colored output
		colors: true
	}

};
