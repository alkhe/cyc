import { join } from 'path';
import { optimize as oz } from 'webpack';

const loaders = [{ test: /\.js$/, loader: 'babel-loader' }];
const clientOutput = {
	path: join(__dirname, 'public/lib'),
	filename: '[name].js',
	publicPath: '/lib/'
};
const productionPlugins = [
	new oz.DedupePlugin(),
	new oz.OccurrenceOrderPlugin(),
	new oz.UglifyJsPlugin({
		compressor: { screw_ie8: true, warnings: false }
	}),
	new oz.AggressiveMergingPlugin()
];

export { clientOutput, loaders, productionPlugins }
