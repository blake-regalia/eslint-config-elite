import {fold, error, off, under, warn} from '../util.js';

export const H_RULES_STYLISTIC = under({
	'@stylistic/': {
		...under({
			'no-': {
				...warn([
					'extra-semi',
					'mixed-spaces-and-tabs'
				]),
			},
		}),

		...warn([
			'type-annotation-spacing',
			'comma-spacing',
			'func-call-spacing',
		]),

		...{
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

			'quotes': ['warn', 'single', {
				avoidEscape: true,
				allowTemplateLiterals: true,
			}],
		},
		
		...under({
			'no-': {
				'extra-parens': ['warn', 'all', {
					nestedBinaryExpressions: false,
					returnAssign: false,
					enforceForNewInMemberExpressions: false,
					enforceForFunctionPrototypeMethods: false,
					enforceForSequenceExpressions: false,
				}],
			},

			'member-': {
				'delimiter-style': ['warn'],
			},
		}),

		// extension rules
		'brace-style': ['warn', 'stroustrup', {
			allowSingleLine: true,
		}] as any,

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
});
