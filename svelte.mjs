const A_CORE = require('./dist/main.cjs');
import svelte from 'eslint-plugin-svelte';

const GC_APP = A_CORE[1];

export default [
	...A_APP,

	{
		...GC_APP,
		files: ['*.svelte'],
		extends: ['plugin:svelte/recommended'],
		plugins: {
			'svelte': svelte,
		},
		languageOptions: {
			parser: 'svelte-eslint-parser',
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				parser: {
					js: 'espree',
					ts: '@typescript-eslint/parser',
					typescript: '@typescript-eslint/parser',
				},
			},
		},
		settings: {
			...GC_APP.settings,

			svelte: {
				ignoreWarnings: [
					'a11y-no-static-element-interactions',
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
];
