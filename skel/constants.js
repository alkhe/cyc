import { join } from 'path';
import { optimize as oz } from 'webpack';
import routes from './routes';

let routesToEntry = routes => {
	let entries = {};
	for (let i = 0; i < routes.length; i++) {
		entries[i] = routes[i].app;
	}
	return entries;
};

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

const entry = routesToEntry(routes);

export { entry, clientOutput, loaders, productionPlugins }
