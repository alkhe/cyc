import jade from 'jade';
import mvi from './src/js/mvi';
import fs from 'fs';

const template = jade.compileFile('./src/html/index.jade');

import { run } from '@cycle/core';
import { makeHTMLDriver } from '@cycle/dom';

const main = ({ DOM }) => ({ DOM: mvi(DOM) });
const DOM = makeHTMLDriver();

run(main, { DOM })
	.sources.DOM
	.forEach(ssr => {
		fs.writeFileSync('./public/index.html', template({ ssr }));
	});
