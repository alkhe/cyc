import { default as w, optimize as oz } from 'webpack';
import loaders from './loaders';
import nodeExternals from 'webpack-node-externals';

export default {
	entry: './index.js',
	output: {
		path: __dirname,
		filename: 'server.js'
	},
	plugins: [
		new w.DefinePlugin({
			'process.env.NODE_ENV': '\'production\''
		}),
		// new oz.DedupePlugin(),
		// new oz.OccurrenceOrderPlugin(),
		// new oz.UglifyJsPlugin({
		// 	compressor: { screw_ie8: true, warnings: false }
		// }),
		// new oz.AggressiveMergingPlugin()
	],
	target: 'node',
	externals: [nodeExternals()],
	module: { loaders }
};
