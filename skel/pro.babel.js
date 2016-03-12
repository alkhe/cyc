import { default as w, optimize as oz } from 'webpack';
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
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		new oz.DedupePlugin(),
		new oz.OccurrenceOrderPlugin(),
		new oz.UglifyJsPlugin({
			compressor: { screw_ie8: true, warnings: false }
		}),
		new oz.AggressiveMergingPlugin()
	],
	module: { loaders }
};
