import type {ESLint, Linter} from 'eslint';

import globals from 'globals';

import {entries, from_entries} from '@blake.regalia/belt';

import eslintjs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint, { type Config } from 'typescript-eslint';
import tseslint_parser from '@typescript-eslint/parser';
import * as modules_newline from 'eslint-plugin-modules-newline';
import * as eslint_plugin_import_x from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import {off} from './util.js';
import {H_RULES_TSESLINT} from './rules/tseslint.js';
import {H_RULES_STYLISTIC} from './rules/stylistic.js';
import {H_RULES_ESLINT} from './rules/eslint.js';
import {H_RULES_IMPORT_X} from './rules/import-x.js';

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
			// extraFileExtensions: ['.svelte'],
		},
	},

	plugins: {
		'@stylistic': stylistic as any,
		'@typescript-eslint': tseslint.plugin as ESLint.Plugin,
		'import-x': eslint_plugin_import_x as any,
	},

	settings: {
		'import-x/extensions': [
			'.ts',
			'.js',
			'.cjs',
			'.mjs',
			'.svelte',
		],

		'import-x/external-module-folders': [
			'node_modules',
			'node_modules/@types',
		],

		'import-x/parsers': {
			'@typescript-eslint/parser': [
				'.ts',
				'.svelte',
			],
		},

		'import-x/resolver': {
			typescript: {
				alwaysTryTypes: true,

				extensions: [
					'.ts',
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

		...H_RULES_IMPORT_X,
		...H_RULES_STYLISTIC,
		...H_RULES_TSESLINT as any,
	},
} as Linter.Config;

const R_TYPED_PLUGINS = /^@?(typescript-eslint|stylistic|import-x)\//;

const A_TYPES_JS = ['**/*.{js,cjs,mjs,jsx}'];
const A_TYPES_TS = ['**/*.{ts,mts,cts,tsx,d.ts}'];

const ts_files_only = (g_config: Linter.Config) => ({
	...g_config,
	files: A_TYPES_TS,
});

const a_export = tseslint.config([
	{
		name: 'eslint-all',
		rules: {
			...eslintjs.configs.recommended.rules,
			...H_RULES_ESLINT as any,
		},
	},
	...tseslint.configs.strictTypeChecked.map(g => ts_files_only(g as Linter.Config)),
	{
		name: 'tseslint-stylistic-type-checked',
		files:A_TYPES_TS,
		rules: tseslint.configs.stylisticTypeChecked.at(-1)!.rules || {},
	},
	// eslint_plugin_import_x.flatConfigs.recommended,
	// eslint_plugin_import_x.flatConfigs.typescript,

	// for all untyped js
	{
		...tseslint.configs.disableTypeChecked,
		files: A_TYPES_JS,
		ignores: [
			'**/*.{ts,svelte}'
		],
	},
	{
		name: 'elite-untyped',

		files: [
			...A_TYPES_JS,
			...A_TYPES_TS,
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

		ignores: [
			'**/*.{js,cjs,mjs}',
		],

		rules: from_entries(entries(G_APP.rules)
			.filter(([si_rule, w_rule]) => R_TYPED_PLUGINS.test(si_rule))),
	},
]);

export default a_export;