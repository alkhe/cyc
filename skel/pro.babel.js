import w from 'webpack';
import { clientOutput, loaders, productionPlugins } from './constants';

export default {
	entry: {
		index: './src/js'
	},
	output: clientOutput,
	module: { loaders },
	plugins: [
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		...productionPlugins
	]
};
