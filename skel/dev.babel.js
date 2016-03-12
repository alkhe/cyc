import { default as w, optimize as oz } from 'webpack';
import path from 'path';
import loaders from './loaders';

export default {
	entry: ['webpack-hot-middleware/client', './src/js'],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/lib/'
	},
	plugins: [
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		new oz.OccurrenceOrderPlugin(),
		new w.HotModuleReplacementPlugin(),
		new w.NoErrorsPlugin()
	],
	devtool: 'eval',
	module: { loaders }
};
