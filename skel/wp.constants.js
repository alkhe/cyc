import { join } from 'path'
import w, { optimize as oz } from 'webpack'
import routes from './routes'

let routesToEntry = routes => {
	let entries = {}
	routes.forEach(route => {
		entries[route.id] = route.app
	})
	return entries
}

const loaders = [{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }]

const clientOutput = {
	path: join(__dirname, 'public/lib'),
	filename: '[hash]-[name].js',
	publicPath: '/lib/'
}

const plugins = [
	new w.DefinePlugin({
		Restarter: `
			(Cycle => {
				let dispose = () => {}
				return (main, drivers) => {
					dispose()
					let { run, sinks, sources } = Cycle(main, drivers)
					dispose = run()
					return { sinks, sources }
				}
			})
		`
	})
]

const productionPlugins = [
	new oz.DedupePlugin(),
	new oz.OccurrenceOrderPlugin(),
	new oz.UglifyJsPlugin({
		compressor: { screw_ie8: true, warnings: false }
	}),
	new oz.AggressiveMergingPlugin()
]

const entry = routesToEntry(routes)

export { entry, clientOutput, loaders, plugins, productionPlugins }
