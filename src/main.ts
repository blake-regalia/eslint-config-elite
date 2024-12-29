import type {Linter} from 'eslint';

import {FlatCompat} from '@eslint/eslintrc';

import globals from 'globals';

import {
	entries,
	fold,
	from_entries,
} from '@blake.regalia/belt';

import eslintjs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import tseslint_parser from '@typescript-eslint/parser';
import * as modules_newline from 'eslint-plugin-modules-newline';
import * as eslint_plugin_i from 'eslint-plugin-i';
import perfectionist from 'eslint-plugin-perfectionist';
import { under, off, warn, error} from './util.js';
import { H_RULES_TSESLINT } from './rules/tseslint.js';
import { H_RULES_STYLISTIC } from './rules/stylistic.js';
import { H_RULES_ESLINT } from './rules/eslint.js';

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
});

const G_APP = {
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		globals: {
			...globals.browser,
			...globals.node,
			chrome: 'readonly',
		},
		parser: tseslint_parser,
		parserOptions: {
			tsconfigRootDir: import.meta.dirname,
			extraFileExtensions: ['.svelte'],
		},
	},

	settings: {
		'i/parsers': {
			'@typescript-eslint/parser': [
				'.ts',
				'.svelte',
			],
		},

		'i/resolver': {
			typescript: {
				alwaysTryTypes: true,

				extensions: [
					'.ts',
					'.d.ts',
					'.svelte',
				],
			},
		},
	},

	rules: {
		// superceded by typescript-eslint
		...off([
			'object-curly-spacing',
			'padding-line-between-statements',
			'quotes',
			'no-redeclare',
			'no-throw-literal',
			'no-ex-assign',
		]),

		...under({
			// 'modules-newline/': {
			// 	'import-declaration-newline': ['warn'],
			// 	'export-declaration-newline': ['warn'],
			// },

			'i/': {
				...warn([
					'no-duplicates',
					'no-self-import',
					// 'first',
				]),

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
		}),
		
		...H_RULES_STYLISTIC,
		...H_RULES_TSESLINT as any,
		...H_RULES_ESLINT,
	},
} satisfies Linter.Config;

const R_TYPED_PLUGINS = /^@(typescript|stylistic)/;

const a_export = tseslint.config([
	eslintjs.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,

	// for all untyped js
	{
		name: 'elite-untyped',

		files: [
			'**/*.{js,cjs,mjs,ts,d.ts,tsx}',
		],

		// default env that applies to all contexts
		languageOptions: {
			ecmaVersion: 2022,
		},

		plugins: {
			'perfectionist': perfectionist.configs['recommended-natural'] as any,
			'modules-newline': modules_newline as any,
			'i': eslint_plugin_i as any,
		},

		ignores: [
			'dist/',
			'node_modules/',
			'submodules/',
		],

		// inherit non-typescript rules from app config
		rules: from_entries(entries(G_APP.rules)
			.filter(([si_rule, w_rule]) => !R_TYPED_PLUGINS.test(si_rule))),
	},

	// strongly typed
	{
		...G_APP,
		name: 'elite-typescript',
		files: ['**/*.{ts,d.ts,tsx}'],
		plugins: {
			// ...G_APP.plugins ?? {},
			'@stylistic': stylistic as any,
			// '@typescript-eslint': typescript_eslint as any,
			'@typescript-eslint': tseslint.plugin,
		},

		rules: from_entries(entries(G_APP.rules)
			.filter(([si_rule, w_rule]) => R_TYPED_PLUGINS.test(si_rule))),
	},
]);

export default a_export;