const gc_core = require('./dist/main.cjs');

const GC_APP = gc_core.overrides[0];

module.exports = {
	// all plugins used
	plugins: [
		...gc_core.plugins,
		'svelte',
	],

	// file-specific overrides
	overrides: [
		...gc_core.overrides,
		{
			...GC_APP,
			files: ['*.svelte'],
			extends: ['plugin:svelte/recommended'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: {
					js: 'espree',
					ts: '@typescript-eslint/parser',
					typescript: '@typescript-eslint/parser',
				},
			},
			settings: {
				...GC_APP.settings,

				svelte: {
					ignoreWarnings: [
						'a11y-no-static-element-interactions'
					],
				},

				// // typescript lib
				// 'svelte3/typescript': () => require('typescript'),
				// 'svelte3/ignore-styles': () => true,
				// 'svelte3/ignore-warnings': ({code}) => [
				// 	'a11y-click-events-have-key-events',
				// ].includes(code),
			},

			rules: {
				...GC_APP.rules,

				'svelte/valid-compile': ['error', {
					ignoreWarnings: true,
				}],
			},
		},
	],
};
