'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fsExtra = require('fs-extra');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// replace all instances of `find` in `dir` with `replace`
var replaceIn = function replaceIn(dir, find, replace) {
	(0, _fsExtra.readdirSync)(dir).forEach(function (c) {
		var oldName = _path2.default.join(dir, c);
		if (c !== 'node_modules') {
			var name = oldName.replace(find, replace);
			(0, _fsExtra.renameSync)(oldName, name);
			if ((0, _fsExtra.statSync)(name).isDirectory()) {
				replaceIn(name, find, replace);
			} else {
				(0, _fsExtra.writeFileSync)(name, (0, _fsExtra.readFileSync)(name, 'utf8').replace(find, replace));
			}
		}
	});
};

exports.default = replaceIn;