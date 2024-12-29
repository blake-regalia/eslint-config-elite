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
import { H_RULES_I } from './rules/i.js';
import { glob } from 'fs';

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname,
});

const G_APP = {
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: 'module',
		globals: {
			...globals.builtin,
			...globals.node,
			...globals.browser,
			chrome: 'readonly',
		},
		parser: tseslint_parser,
		parserOptions: {
			tsconfigRootDir: process.cwd(),
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

		// ...under({
			// 'modules-newline/': {
			// 	'import-declaration-newline': ['warn'],
			// 	'export-declaration-newline': ['warn'],
			// },

		...H_RULES_I,
		...H_RULES_STYLISTIC,
		...H_RULES_TSESLINT as any,
		...H_RULES_ESLINT,
	},
} satisfies Linter.Config;

const R_TYPED_PLUGINS = /^@?(typescript-eslint|stylistic|i)\//;

const A_TYPES_JS = ['**/*.{js,cjs,mjs,jsx}'];
const A_TYPES_TS = ['**/*.{ts,mts,cts,tsx,d.ts}'];

const ts_files_only = (g_config: Linter.Config) => ({
	...g_config,
	files: A_TYPES_TS,
});

const a_export = tseslint.config([
	eslintjs.configs.recommended,
	...tseslint.configs.strictTypeChecked.map(g => ts_files_only(g as Linter.Config)),
	...tseslint.configs.stylisticTypeChecked.map(g => ts_files_only(g as Linter.Config)),

	// for all untyped js
	{
		files: A_TYPES_JS,
		extends: [tseslint.configs.disableTypeChecked],
	},
	{
		name: 'elite-untyped',

		files: [
			A_TYPES_JS,
			A_TYPES_TS,
		],

		// default env that applies to all contexts
		languageOptions: {
			ecmaVersion: 2022,
		},

		plugins: {
			'perfectionist': perfectionist.configs['recommended-natural'] as any,
			'modules-newline': modules_newline as any,
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
		files: A_TYPES_TS,
		plugins: {
			// ...G_APP.plugins ?? {},
			'@stylistic': stylistic as any,
			// '@typescript-eslint': typescript_eslint as any,
			'@typescript-eslint': tseslint.plugin,
			'i': eslint_plugin_i as any,
		},

		ignores: [
			'**/*.{js,cjs,mjs}',
		],

		rules: from_entries(entries(G_APP.rules)
			.filter(([si_rule, w_rule]) => R_TYPED_PLUGINS.test(si_rule))),
	},
]);

export default a_export;