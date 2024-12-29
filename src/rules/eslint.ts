import {error, off, under, warn} from "../util.js";

export const H_RULES_ESLINT = {
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
				'sparse-arrays',
				'consstant-binary-expression',
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
			} as any],
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
};
