import express from 'express';
import jade from 'jade';

const log = ::console.log;

const production = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

const app = express();
const router = express.Router();

if (production) {
	log('[pro]');
	app.use(require('compression')());
}
else {
	log('[dev]');
	const config = require('./dev.babel').default,
		compiler = require('webpack')(config),
		dev = require('webpack-dev-middleware'),
		hot = require('webpack-hot-middleware');

	app.use(dev(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	})).use(hot(compiler));
}

import { makeHTMLDriver } from '@cycle/dom';
const renderer = makeHTMLDriver();

const viewsource = require.resolve('./src/js/view');
let view = require(viewsource).default;

const template = jade.compileFile('./src/html/index.jade');

if (!production) {
	require('chokidar')
		.watch(viewsource)
		.on('change', () => {
			delete require.cache[viewsource];
			view = require(viewsource).default;
			log('[dev] reloaded view');
		});
}

router.get('/', (req, res) => {
	renderer(view().first())
		.first()
		.forEach(DOM => {
			res.end(template({ ssr: DOM }));
		});
});

app
	.use(router)
	.use(express.static('./public'));

app.listen(port, 'localhost', err => {
	if (err) {
		return console.err(err);
	}
	log(`listening on http://localhost:${ port }`);
});
