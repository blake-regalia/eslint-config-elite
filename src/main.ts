import type {
	Dict,
} from '@blake.regalia/belt';

import {
	fold,
} from '@blake.regalia/belt';

import {A_NAMING_CONVENTION_RULES} from './naming.js';

import * as typescript_eslint from '@typescript-eslint/eslint-plugin';
// import * as sort_keys from 'eslint-plugin-typescript-sort-keys';
import * as modules_newline from 'eslint-plugin-modules-newline';
import * as eslint_plugin_i from 'eslint-plugin-i';
import perfectionist from 'eslint-plugin-perfectionist';

function under(h_map: Dict<Dict<unknown>>): Dict<unknown> {
	const h_out: Dict<unknown> = {};

	for(const [si_prefix, h_parts] of Object.entries(h_map)) {
		for(const [si_suffix, w_value] of Object.entries(h_parts)) {
			h_out[si_prefix+si_suffix] = w_value;
		}
	}

	return h_out;
}


const off = (a_rules: string[]) => fold(a_rules, s => ({[s]:'off'}));
const warn = (a_rules: string[]) => fold(a_rules, s => ({[s]:'warn'}));
const error = (a_rules: string[]) => fold(a_rules, s => ({[s]:'error'}));

const GC_APP = {
	env: {
		es2020: true,
		browser: true,
	},

	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		extraFileExtensions: [
			'.svelte',
		],
	},

	// inherit from recommended configs
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/strict',
	],

	globals: {
		chrome: 'readonly',
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

			'@typescript-eslint/': {
				'consistent-indexed-object-style': ['warn', 'record'],

				'explicit-module-boundary-types': ['warn'],

				...off([
					'array-type',
					'restrict-plus-operands',
					'ban-types',
					'consistent-type-definitions',
				]),

				...warn([
					'switch-exhaustiveness-check',
					'type-annotation-spacing',
					'unified-signatures',
					'comma-spacing',
					'func-call-spacing',
					'consistent-type-imports',
				]),

				...error([
					'default-param-last',
				]),

				// extends/overrides base eslint rules
				...{
					'dot-notation': 'off',

					// disabled until implementing custom rule to allow space in import statements
					'object-curly-spacing': 'off',
					'padding-line-between-statements': ['warn',
						fold([
							'block',
							'block-like',
							// 'import/import',
						], sx_rule => ({
							blankLine: 'always',
							prev: sx_rule.split(/\//)[0],
							next: sx_rule.split(/\//)[1] || '*',
						})),
					],
					"quotes": ['warn', 'single', {
						avoidEscape: true,
						allowTemplateLiterals: true,
					}],
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
						]),

						...warn([
							'unnecessary-qualifier',
							'loop-func',
							'unused-expressions',
							'unused-vars',
							'useless-constructor',
						]),

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

						'extra-parens': ['warn', 'all', {
							nestedBinaryExpressions: false,
							returnAssign: false,
							enforceForNewInMemberExpressions: false,
							enforceForFunctionPrototypeMethods: false,
							enforceForSequenceExpressions: false,
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
						]),
					},

					'member-': {
						'delimiter-style': ['warn'],

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

				// extension rules
				'brace-style': ['warn', 'stroustrup', {
					allowSingleLine: true,
				}],
				'comma-dangle': ['warn', {
					arrays: 'always-multiline',
					objects: 'always-multiline',
					imports: 'always-multiline',
					exports: 'always-multiline',
					functions: 'never',
					enums: 'always-multiline',
					generics: 'always-multiline',
					tuples: 'always-multiline',
				}],
				'indent': ['warn', 'tab', {
					SwitchCase: 1,
					VariableDeclarator: 0,
					ignoreComments: true,
					ignoredNodes: [
						'TSTypeParameterInstantiation',
					],
				}],
				'keyword-spacing': ['warn', {
					overrides: {
						if: {after:false},
						for: {after:false},
						await: {after:false},
						while: {after:false},
						switch: {after:false},
						catch: {after:false},
					},
				}],
				'lines-between-class-members': ['warn', 'always', {
					exceptAfterSingleLine: true,
				}],
				'object-curly-spacing': ['warn'],
				'quotes': ['warn', 'single', {
					avoidEscape: true,
					allowTemplateLiterals: true,
				}],
				'semi': ['warn', 'always'],
				'space-before-function-paren': ['warn','never'],
			},
		}),


		// eslint
		...{
			'for-direction': ['error'],
			'getter-return': ['error', {
				allowImplicit: true,
			}],
			// # 
			'valid-typeof': ['error', {
				requireStringLiterals: true,
			}],

			// # "Best Practices"
			'array-callback-return': ['error'],
			'class-methods-use-this': ['warn'],
			'curly': ['error', 'multi-line', 'consistent'],
			'default-case': ['error'],
			'dot-location': ['error', 'property'],
			'eqeqeq': ['error'],

			...under({
				'no-': {
					...off([
						'inner-declarations',
						'async-promise-executor',
					]),

					...warn([
						'extra-label',
						'self-assign',
						'unused-labels',
						'useless-concat',
						'useless-escape',
						'warning-comments',
						'shadow-restricted-names',
						'lonely-if',
						'mixed-operators',
						'whitespace-before-property',
						'useless-computed-key',
						'sequences',
					]),

					...error([
						'caller',
						'extend-native',
						'extra-bind',
						'implied-eval',
						'iterator',
						'multi-str',
						'new-func',
						'new-wrappers',
						'octal-escape',
						'proto',
						'script-url',
						'self-compare',
						'throw-literal',
						'unmodified-loop-condition',
						'useless-call',
						// 'void',
						'with',
						'new-object',

						// variables
						'label-var',
						'restricted-globals',
						'undef-init',
						'undefined',
						'var',
					]),

					// 'sequences': ['warn', {
					// 	allowInParentheses: true,
					// }],

					'trailing-spaces': ['warn', {
						ignoreComments: true,
					}],

					'multiple-empty-lines': ['warn', {
						max: 3,
					}],
					'unneeded-ternary': ['warn', {
						defaultAssignment: false,
					}],

					'multi-spaces': ['warn', {
						ignoreEOLComments: true,
					}],

					'await-in-loop': ['off'],
					'cond-assign': ['error', 'except-parens'],
					'console': ['warn', {
						allow: ['time', 'warn', 'error', 'assert'],
					}],
					'control-regex': ['off'],
					'debugger': ['warn'],
					'empty': ['error', {
						allowEmptyCatch: true,
					}],

					'template-curly-in-string': ['warn'],

					// 'wrap-iife': ['error', 'inside'],
				},

				'prefer-': {
					...warn([
						'const',
						'spread',
						'promise-reject-errors',
					]),

					'arrow-callback': ['warn', {
						allowNamedFunctions: true,
					}],
				},
			}),

			'wrap-iife': ['error', 'inside'],

			// eslint stylistic
			'array-bracket-spacing': ['warn', 'never'],
			'comma-style': ['warn'],
			'computed-property-spacing': ['warn'],
			'eol-last': ['warn'],
			'implicit-arrow-linebreak': ['warn'],
			'key-spacing': ['warn', {
				singleLine: {
					beforeColon: false,
					afterColon: false,
				},
				multiLine: {
					mode: 'strict',
					beforeColon: false,
					afterColon: true,
				},
			}],
			'linebreak-style': ['error', 'unix'],
			// 'multiline-ternary': ['warn', 'always-multiline'],
			'multiline-ternary': 'off',

			'new-cap': ['warn', {
				newIsCap: false,
				capIsNewExceptionPattern: '^[A-Z$_][A-Z$_0-9]*',
				capIsNew: true,
				properties: false,
			}],
			'new-parens': ['warn'],
			'nonblock-statement-body-position': ['error', 'beside'],
			// 'object-curly-newline': ['warn', {
			// 	ObjectExpression: {
			// 		multiline: true,
			// 		minProperties: 2,
			// 	},
			// 	ObjectPattern: {
			// 		multiline: true,
			// 		minProperties: 2,
			// 	},
				// ImportDeclaration: {
				// 	multiline: true,
				// 	minProperties: 3,
				// },
			// 	ExportDeclaration: {
			// 		multiline: true,
			// 		minProperties: 2,
			// 	},
			// }],
			'object-property-newline': ['warn', {
				allowAllPropertiesOnSameLine: true,
			}],
			'one-var': ['warn', {
				initialized: 'never',
			}],
			'operator-assignment': ['warn'],
			'operator-linebreak': ['warn', 'before'],
			'padded-blocks': ['warn', 'never'],
			'quote-props': ['warn', 'consistent-as-needed'],
			'semi-spacing': ['warn', {
				before: false,
				after: true,
			}],
			'semi-style': ['error'],
			'space-before-blocks': ['warn','always'],
			'space-in-parens': ['warn','never'],
			'space-unary-ops': ['warn', {
				words: true,
				nonwords: false,
			}],
			'spaced-comment': ['warn','always', {
				exceptions: ['-*', '#__PURE__'],
				markers: ['/'],
			}],
			'switch-colon-spacing': ['warn'],
			'template-tag-spacing': ['warn'],
			'yoda': ['warn', 'always', {
				onlyEquality: true,
			}],

			// es6
			'arrow-body-style': ['warn', 'as-needed'],
			'arrow-parens': ['warn', 'as-needed', {
				requireForBlockBody: true,
			}],
			'arrow-spacing': ['warn'],
			'generator-star-spacing': ['warn', {
				named: 'after',
				anonymous: 'before',
				method: 'after',
			}],
			// # prefer-template: warn
			'rest-spread-spacing': ['warn', 'never'],
			'symbol-description': ['warn'],
			'template-curly-spacing': ['warn'],
			'yield-star-spacing': ['warn'],
			'no-fallthrough': ['warn'],
		},
	},
};

export default {
	// top-level property
	root: true,

	// default env that applies to all contexts
	env: {
		es2020: true,
	},

	// // all plugins used
	// plugins: [
	// 	'@typescript-eslint',
	// 	'typescript-sort-keys',
	// 	'modules-newline',
	// 	'i',
	// ],
	plugins: {
		'@typescript-eslint': typescript_eslint,
		// 'typescript-sort-keys': sort_keys,
		'perfectionist': perfectionist.configs['recommended-natural'],
		'modules-newline': modules_newline,
		'i': eslint_plugin_i,
	},

	// file-specific overrides
	overrides: [
		{
			files: ['*.ts', '*.d.ts'],
			...GC_APP,
		},
	],

	// inherit non-typescript rules from app config
	rules: Object.fromEntries(Object.entries(GC_APP.rules)
		.filter(([si_rule, w_rule]) => !si_rule.startsWith('@typescript'))),
};
