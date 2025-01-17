import {error, off, under, warn} from '../util.js';

export const H_RULES_IMPORT_X = under({
	'import-x/': {
		...warn([
			'no-duplicates',
			'no-self-import',
			// 'first',
		]),

		'consistent-type-specifier-style': ['warn', 'prefer-top-level'],

		...under({
			'no-': {
				cycle: ['warn', {
					ignoreExternal: true,
				}],
			},
		}),

		order: ['warn', {
			"groups": [
				'type',
				'builtin',
				'external',
				['sibling', 'parent'],
				'index',
				'object',
			],

			"alphabetize": {
				order: 'asc',
				caseInsensitive: true,
			},

			"pathGroups": [
				{
					pattern: 'ts-toolbelt',
					group: 'type',
					position: 'before',
				},
				{
					pattern: 'ts-toolbelt/**',
					group: 'type',
					position: 'before',
				},
				{
					pattern: '#/{meta,schema}/**',
					group: 'type',
					position: 'after',
				},
				{
					pattern: '{#,##}/**',
					group: 'type',
					position: 'after',
				},
				{
					pattern: '{#,##}/**',
					group: 'sibling',
					position: 'before',
				},
				// {
				// 	pattern: '{.,..}/**/*.ts',
				// 	group: 'index',
				// },
				// {
				// 	pattern: './*',
				// 	group: 'index',
				// },
				{
					pattern: '{.,..}/**/*.svelte',
					group: 'index',
				},
			],

			'newlines-between': 'always-and-inside-groups',
		}],
	},

	// 'typescript-sort-keys/': {
	// 	'interface': 'off',
	// 	'string-enum': 'off',
	// },
});
