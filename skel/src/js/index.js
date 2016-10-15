/* global CLIENT */
import Cycle from '@cycle/xstream-run'

export let { main, drivers } = require('./main')

export let start = Restarter(Cycle)

if (CLIENT) start(main, drivers)

if (module.hot) {
	require('webpack-hot-middleware/client')
	module.hot.accept(() => {
		let { main, drivers } = require('./main')
		start(main, drivers)
	})
}
