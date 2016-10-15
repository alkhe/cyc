import w from 'webpack';
import { entry, clientOutput, loaders } from './wp.constants';
import macros from './macros';

export default {
	entry,
	output: clientOutput,
	module: { loaders },
	callbackLoader: macros,
	plugins: [
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		new w.HotModuleReplacementPlugin(),
		new w.NoErrorsPlugin()
	],
	devtool: 'eval'
};
