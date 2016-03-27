import express from 'express';
import jade from 'jade';
import makeRequire from 'dynamic-require';

global.CLIENT = false;

// Error.stackTraceLimit = Infinity;

// helper functions
const here = process.cwd();
const log = ::console.log;
const port = process.env.PORT || 3000;
const app = express();
const router = express.Router();

let hotAccept;
const dynamicRequire = makeRequire(here, {
	ast: false,
	comments: false,
	compact: true
});

if (process.env.NODE_ENV === 'production') {
	log('[pro]');
	app.use(require('compression')());
}
else {
	log('[dev]');
	// use dev compilation and hot reloading
	const config = require('./dev.babel').default,
		compiler = require('webpack')(config),
		dev = require('webpack-dev-middleware'),
		hot = require('webpack-hot-middleware');

	app.use(dev(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	})).use(hot(compiler));
	hotAccept = require('./hot').make(compiler, dynamicRequire);
}

/*
compiler.plugin('done', result => {
	let stats = result.toJson().assetsByChunkName;
	console.log(stats.index instanceof Array)
	console.log(stats.about instanceof Array)
})
*/

// takes a config and creates a server endpoint
let endpoint = ({ app, page, route, lib }) => {
	const template = jade.compileFile(page);
	let program = dynamicRequire(app).default;

	if (process.env.NODE_ENV !== 'production') {
		// register program with hot rebuilder
		hotAccept(app, m => { program = m.default; });
	}

	router.get(route, (req, res, next) => {
		log(`GET ${ req.path }`);
		program()
			.sources.DOM
			.forEach(ssr => {
				res.end(template({ ssr, lib }));
			}, next);
	});
}

import routes from './routes';
routes.forEach(endpoint);

app
	.use(router)
	.use(express.static('./public'));

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	log(`listening on http://localhost:${ port }`);
});
