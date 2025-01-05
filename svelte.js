import A_CORE from './dist/mjs/main.js';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

const GC_APP = A_CORE.at(-1);

export default [
	...A_CORE.slice(0, -1),

	...svelte.configs['flat/recommended'],
	{
		...GC_APP,
		name: 'elite-svelte-ts',
		files: [
			'**/*.{ts,svelte}',
			'*.{ts,svelte}',
		],
		plugins: {
			...GC_APP.plugins,
			'svelte': svelte,
		},
		languageOptions: {
			...GC_APP.languageOptions,
			parser: svelteParser,
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
