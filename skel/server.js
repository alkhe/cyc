/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].e;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			e: {},
/******/ 			i: moduleId,
/******/ 			l: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.e, module, module.e, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.e;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	module.e = require("path");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _fs = __webpack_require__(10);

	var _fs2 = _interopRequireDefault(_fs);

	var _path = __webpack_require__(0);

	var _path2 = _interopRequireDefault(_path);

	var _babelCore = __webpack_require__(9);

	var babel = _interopRequireWildcard(_babelCore);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (filename) {
		filename = _path2.default.resolve(filename);
		if (_fs2.default.existsSync(filename)) {
			var _babel$transformFileS = babel.transformFileSync(filename);

			var code = _babel$transformFileS.code;

			var m = new module.constructor();
			console.log(m);
			var localModules = _path2.default.join(process.cwd(), 'node_modules');
			if ((m.paths || []).indexOf(localModules) < 0) {
				m.paths = [localModules].concat(m.paths);
			}
			console.log(m);
			m._compile(code, filename);
			return m.exports;
		}
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module)))

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.e = require("@cycle/core");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.e = require("@cycle/dom");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.e = require("compression");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.e = require("express");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.e = require("jade");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _context;

	var _express = __webpack_require__(5);

	var _express2 = _interopRequireDefault(_express);

	var _jade = __webpack_require__(6);

	var _jade2 = _interopRequireDefault(_jade);

	var _path = __webpack_require__(0);

	var _path2 = _interopRequireDefault(_path);

	var _babelRequire = __webpack_require__(1);

	var _babelRequire2 = _interopRequireDefault(_babelRequire);

	var _core = __webpack_require__(2);

	var _dom = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Error.stackTraceLimit = Infinity;

	// path helper functions
	var here = _path2.default.resolve('.');
	var local = function local() {
		for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
			paths[_key] = arguments[_key];
		}

		return _path2.default.join.apply(_path2.default, [here].concat(paths));
	};

	var log = (_context = console).log.bind(_context);

	var port = process.env.PORT || 3000;
	var app = (0, _express2.default)();
	var router = _express2.default.Router();

	if (true) {
		log('[pro]');
		app.use(__webpack_require__(4)());
	} else {
		log('[dev]');
		// use dev compilation and hot reloading
		var config = require('./dev.babel').default,
		    compiler = require('webpack')(config),
		    dev = require('webpack-dev-middleware'),
		    hot = require('webpack-hot-middleware');

		app.use(dev(compiler, {
			noInfo: true,
			publicPath: config.output.publicPath
		})).use(hot(compiler));
	}

	// create mock DOM driver
	var DOM = (0, _dom.makeHTMLDriver)();

	// takes a config and creates a server endpoint
	var endpoint = function endpoint(_ref) {
		var app = _ref.app;
		var page = _ref.page;
		var route = _ref.route;

		var template = _jade2.default.compileFile(local('src/html', page));
		var program = (0, _babelRequire2.default)(app).default;

		if (false) {
			// register mvi file with hot rebuilder
			require('./hot').accept(app, function (next) {
				program = next;
			});
		}

		// Cycle.run main function
		var main = function main(_ref2) {
			var DOM = _ref2.DOM;
			return { DOM: program(DOM) };
		};

		router.get(route, function (req, res, next) {
			(0, _core.run)(main, { DOM: DOM }).sources.DOM.forEach(function (ssr) {
				res.end(template({ ssr: ssr }));
			}, next);
		});
	};

	endpoint({
		app: './src/js/mvi.js',
		page: './index.jade',
		route: '/'
	});

	app.use(router).use(_express2.default.static('./public'));

	app.listen(port, 'localhost', function (err) {
		if (err) {
			return console.err(err);
		}
		log('listening on http://localhost:' + port);
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.e = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			Object.defineProperty(module, "exports", {
				enumerable: true,
				configurable: false,
				get: function get() {
					return module.e;
				},
				set: function set(v) {
					return module.e = v;
				}
			});
			Object.defineProperty(module, "loaded", {
				enumerable: true,
				configurable: false,
				get: function get() {
					return module.l;
				}
			});
			Object.defineProperty(module, "id", {
				enumerable: true,
				configurable: false,
				get: function get() {
					return module.i;
				}
			});
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.e = require("babel-core");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.e = require("fs");

/***/ }
/******/ ]);