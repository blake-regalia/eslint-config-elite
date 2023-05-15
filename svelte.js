const gc_core = require('./dist/main.cjs');

module.exports = {
	// all plugins used
	plugins: [
		...gc_core.plugins,
		'svelte3',
	],

	// file-specific overrides
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
			...GC_APP,
			// parser: 'svelte-eslint-parser',
			// parserOptions: {
			// 	parser: {
			// 		ts: '@typescript-eslint/parser',
			// 	},
			// },
		},
		...gc_core.overrides,
	],
};
