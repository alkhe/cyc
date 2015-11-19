let production = process.env.NODE_ENV === 'production';

if (production || require('piping')({ hook: true, includeModules: false })) {
	require('./server');
}
