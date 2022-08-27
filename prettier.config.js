/** @format */

const os = require('os');

const conf = {
	useTabs: true,
	tabWidth: 4,
	printWidth: 70,
	semi: true,
	endOfLine: os.platform() === 'win32' ? 'crlf' : 'lf',
	singleQuote: true,
	quoteProps: 'preserve',
	bracketSpacing: true,
	arrowParens: 'always',
	trailingComma: 'all',
	insertPragma: true,
	embeddedLanguageFormatting: 'auto',
};

module.exports = conf;
