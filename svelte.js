const gc_core = require('./dist/main.cjs');

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
			...gc_core.overrides[0],
			files: ['*.svelte'],
			processor: 'svelte3/svelte3',
			// parser: 'svelte-eslint-parser',
			// parserOptions: {
			// 	parser: {
			// 		ts: '@typescript-eslint/parser',
			// 	},
			// },
		},
	],
};
