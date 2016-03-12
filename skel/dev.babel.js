import w, { optimize as oz } from 'webpack';
import { clientOutput, loaders } from './constants';

export default {
	entry: {
		index: ['webpack-hot-middleware/client', './src/js/index'],
		about: ['webpack-hot-middleware/client', './src/js/about'],
	},
	output: clientOutput,
	module: { loaders },
	plugins: [
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		new oz.OccurrenceOrderPlugin(),
		new w.HotModuleReplacementPlugin(),
		new w.NoErrorsPlugin()
	],
	devtool: 'eval'
};
