const gc_core = require('./dist/main.cjs');

const GC_APP = gc_core.overrides[0];

module.exports = {
	// all plugins used
	plugins: [
		...gc_core.plugins,
		'svelte3',
	],

	// file-specific overrides
	overrides: [
		...gc_core.overrides,
		{
			...GC_APP,
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
			settings: {
				...GC_APP.settings,

				// typescript lib
				'svelte3/typescript': () => require('typescript'),
				'svelte3/ignore-styles': () => true,
				'svelte3/ignore-warnings': ({code}) => [
					'a11y-click-events-have-key-events',
				].includes(code),
			},
			// parser: 'svelte-eslint-parser',
			// parserOptions: {
			// 	parser: {
			// 		ts: '@typescript-eslint/parser',
			// 	},
			// },
		},
	],
};
