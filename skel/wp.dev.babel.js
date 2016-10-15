import w, { optimize as oz } from 'webpack'
import { entry, clientOutput, plugins, loaders } from './wp.constants'

export default {
	entry,
	output: clientOutput,
	module: { loaders },
	plugins: [
		...plugins,
		new w.DefinePlugin({
			CLIENT: 'true'
		}),
		new oz.OccurrenceOrderPlugin(),
		new w.HotModuleReplacementPlugin(),
		new w.NoErrorsPlugin()
	],
	devtool: 'eval'
}
