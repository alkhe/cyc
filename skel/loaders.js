export default [
	{ test: /\.js$/, loader: 'babel-loader' },
	{ test: /\.s[ac]ss$/, loader: 'style!css!sass?indentedSyntax=true' }
]
