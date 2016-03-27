import w from 'webpack';
import { entry, clientOutput, loaders, productionPlugins } from './constants';

export default {
	entry,
	output: clientOutput,
	module: { loaders },
	plugins: [
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		...productionPlugins
	]
};
