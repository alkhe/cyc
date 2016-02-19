import { optimize as oz } from 'webpack';
import path from 'path';
import loaders from './loaders';

export default {
	entry: './src/js',
	output: {
		path: path.join(__dirname, 'public/lib'),
		filename: 'bundle.js',
		publicPath: '/lib/'
	},
	plugins: [
		new oz.DedupePlugin(),
		new oz.OccurenceOrderPlugin(),
		new oz.UglifyJsPlugin({
			compressor: { screw_ie8: true, warnings: false }
		}),
		new oz.AggressiveMergingPlugin()
	],
	module: { loaders }
};
