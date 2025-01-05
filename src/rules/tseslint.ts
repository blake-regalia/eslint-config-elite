import {error, off, under, warn} from "../util.js";

import {A_NAMING_CONVENTION_RULES} from '../naming.js';

export const H_RULES_TSESLINT = under({
	'@typescript-eslint/': {
		'consistent-indexed-object-style': ['warn', 'record'],

		'switch-exhaustiveness-check': ['warn', {
			requireDefaultForNonUnion: true,
		}],

		...off([
			'array-type',
			'restrict-plus-operands',
			'ban-types',
			'consistent-type-definitions',
		]),

		...warn([
			'unified-signatures',
			'consistent-type-imports',
			'only-throw-error',
			'explicit-module-boundary-types',
		]),

		...error([
			'default-param-last',
		]),

		// extends/overrides base eslint rules
		...{
			'dot-notation': 'off',
		},

		...under({
			'no-': {
				...off([
					'non-null-assertion',
					'namespace',
					'unnecessary-type-constraint',
					'explicit-any',
					'unsafe-member-access',
					'unsafe-call',
					'unsafe-assignment',
					'unsafe-return',
					'empty-interface',
					'unnecessary-condition',
					'redeclare',
					'dynamic-delete',
					'invalid-void-type',
					'confusing-void-expression',
					'empty-object-type',
					'unnecessary-type-parameters',
					'unsafe-function-type',
					'unnecessary-template-expression',
				]),

				...warn([
					'unnecessary-qualifier',
					'loop-func',
					'unused-expressions',
					'useless-constructor',
					'duplicate-type-constituents',
				]),


				'unused-vars': ['warn', {
					args: 'all',
					argsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					ignoreRestSiblings: true
				}],

				...error([
					'invalid-this',
					'shadow',
				]),


				'floating-promises': ['warn', {
					ignoreVoid: true,
					ignoreIIFE: true,
				}],

				'this-alias': ['warn', {
					allowedNames: [
						'k_self',
						'k_node',
					],
				}],

				'use-before-define': ['error', {
					classes: false,
					variables: false,
					functions: false,
					ignoreTypeReferences: true,
				}],

				'misused-promises': ['warn', {
					checksVoidReturn: {
						arguments: false,
					},
				}],
			},

			'prefer-': {
				...off([
					'nullish-coalescing',
				]),

				...warn([
					'for-of',
					'optional-chain',
					'ts-expect-error',
					'readonly',
					'promise-reject-errors',
					'function-type',
				]),
			} as any,

			'member-': {
				'ordering': ['warn', {
					classes: [
						'static-field',
						'static-method',
						'instance-field',
						'constructor',
						'abstract-field',
						'abstract-method',
						'instance-method',
					].flatMap(s => [`private-${s}`, `protected-${s}`, `public-${s}`])
						.filter(s => !['private-abstract-field', 'private-abstract-method'].includes(s)),
				}],
			},
		}),

		'restrict-template-expressions': ['warn', {
			allowNumber: true,
			allowBoolean: true,
			allowAny: true,
		}],

		'class-literal-property-style': ['warn', 'fields'],

		'naming-convention': ['warn', ...A_NAMING_CONVENTION_RULES],
	},
});
