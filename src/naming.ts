import { oderac } from "@blake.regalia/belt";

const SX_POW2 = '(?:8|16|32|64)';

const A_PRIMITIVE_STRING = [
	`s([aghipqrx]|x?b\\d+)?`, 'p[r]?',
];

const H_PRIMITIVES: Record<NamingConvTypes | '_other', string[]> = {
	boolean: [
		'b',
	],
	number: [
		'c[b]?', 'i([bt]|px)?', 'n([bil]?|px)', `x(?:a[rd]|[b-z][l]?|[uifg]${SX_POW2})?`,
	],
	string: A_PRIMITIVE_STRING,
	array: [
		'a\\d*',
	],
	function: [
		'f[gk]?e?',
	],
	_other: [
		'd[a-z]{0,2}', 'e', 'g[ca-z]?',
		'h[m]?', 'k[a-z]{0,2}', 'm', 'r[t]?',
		...A_PRIMITIVE_STRING,
		't', 'v', 'w', 'x[cg]', 'y[a-z]{0,2}', 'z[a-z]{0,2}',
		'a[btsx]', 'at[uif](8|16|32|64)',
	],
};

const A_SNAKE_TYPES = [
	...Object.values(H_PRIMITIVES).flat(),
];

const S_SNAKE_TYPES_UPPER = A_SNAKE_TYPES.map(s => s.toUpperCase()).join('|');

type NamingConvModifier = 
	| 'abstract'
	| 'override'
	| 'private'
	| 'protected'
	| 'readonly'
	| 'static'
	| 'async'
	| 'const'
	| 'destructured'
	| 'exported'
	| 'global'
	| '#private'
	| 'public'
	| 'requiresQuotes'
	| 'unused';

type NamingConvSelector = 'accessor'
	| 'class'
	| 'classMethod'
	| 'classProperty'
	| 'enum'
	| 'enumMember'
	| 'function'
	| 'interface'
	| 'objectLiteralMethod'
	| 'objectLiteralProperty'
	| 'parameter'
	| 'parameterProperty'
	| 'typeAlias'
	| 'typeMethod'
	| 'typeParameter'
	| 'typeProperty'
	| 'variable';

type NamingConvTypes =
	| 'array'
	| 'boolean'
	| 'function'
	| 'number'
	| 'string';

type NamingConvFormat =
	| 'camelCase'
	| 'strictCamelCase'
	| 'PascalCase'
	| 'StrictPascalCase'
	| 'snake_case'
	| 'UPPER_CASE';

type SnakeConvType = NamingConvTypes | '_other';

interface NamingConvOption {
	format: NamingConvFormat[] | null
	custom?: {
		regex: string;
		match: boolean;
	};
	leadingUnderscore?: 'forbid'
		| 'require'
		| 'requireDouble'
		| 'allow'
		| 'allowDouble'
		| 'allowSingleOrDouble';
	trailingUnderscore?:
		| 'forbid'
		| 'require'
		| 'requireDouble'
		| 'allow'
		| 'allowDouble'
		| 'allowSingleOrDouble';
	prefix?: string[];
	suffix?: string[];

	// selector options
	selector: NamingConvSelector | NamingConvSelector[];
	filter?: string | {
		regex: string;
		match: boolean;
	};
	// the allowed values for these are dependent on the selector - see below
	modifiers?: NamingConvModifier[];
	types?: NamingConvTypes[];
}

interface SnakeConfig {
	patterns: string[];
	caps?: 'only' | 'optional';
	short?: boolean;
	selector?: NamingConvSelector;
	modifiers?: NamingConvModifier[];
	format?: NamingConvFormat[];
	regex?: string;
	types?: SnakeConvType[];
}

function* snake_types(a_configs: SnakeConfig[]) {
	for(const gc_types of a_configs) {
		const a_snake_types = gc_types.patterns;

		let s_inner = '';

		if('only' !== gc_types.caps) {
			s_inner = a_snake_types.join('|');
		}

		if(gc_types.caps) {
			s_inner += `|${a_snake_types.map(s => s.toUpperCase()).join('|')}`;
		}

		const s_post = gc_types.short? '(_|$)': '_';

		const g_opt: NamingConvOption = {
			selector: gc_types.selector || 'variable',
			modifiers: gc_types.modifiers || [],
			format: [...
				new Set([
					'snake_case',
					...(['only', 'optional'].includes(gc_types.caps || '')? ['UPPER_CASE']: []),
					...(gc_types.format? gc_types.format: []),
				]),
			] as NamingConvOption['format'],
			custom: {
				regex: (gc_types.regex? '(?:': '')+`^(${s_inner})${s_post}`+(gc_types.regex? `|${gc_types.regex})`: ''),
				match: true,
			},
		};

		const as_types = new Set(gc_types.types);
		as_types.delete('_other');
		gc_types.types = [...as_types];

		if(gc_types.types.length) g_opt.types = gc_types.types as NamingConvTypes[];

		yield g_opt;
	}
}

export const A_NAMING_CONVENTION_RULES = [
	{
		selector: 'typeParameter',
		format: ['snake_case'],
		leadingUnderscore: 'forbid',
		// filter: /^[a-z]/,
	},

	// type declaration names
	{
		selector: 'typeLike',
		format: ['StrictPascalCase'],
		leadingUnderscore: 'forbid',
		// filter: /^[A-Z]/,
	},

	// assertion assignments
	{
		selector: 'variable',
		filter: '_Assertion$',
		suffix: ['_Assertion'],
		format: ['StrictPascalCase'],
		leadingUnderscore: 'forbid',
	},

	// {
	// 	selector: 'variable',
	// 	modifiers: ['const', 'global'],
	// 	format: ['UPPER_CASE'],
	// 	custom: {
	// 		regex: `^(${S_SNAKE_TYPES_UPPER})_`,
	// 		match: true,
	// 	},
	// },
	// {
	// 	selector: 'variable',
	// 	format: ['snake_case'],
	// 	custom: {
	// 		regex: `^(${S_SNAKE_TYPES_LOWER}|${S_SNAKE_TYPES_UPPER})_`,
	// 		match: true,
	// 	},
	// },

	...snake_types(oderac(H_PRIMITIVES, (si_type, a_patterns) => ({
		selector: 'variable',
		modifiers: ['const', 'global'],
		types: [si_type],
		patterns: a_patterns,
		caps: 'optional',
		format: 'function' === si_type? ['snake_case']: [],
		regex: 'function' === si_type? '[a-z][a-z0-9_]+': '',
	}))),
	...snake_types(oderac(H_PRIMITIVES, (si_type: SnakeConvType, a_patterns) => ({
		selector: 'variable',
		types: [si_type],
		patterns: a_patterns,
		caps: 'optional',
	}))),
	...snake_types(oderac(H_PRIMITIVES, (si_type, a_patterns) => ({
		selector: 'parameter',
		types: [si_type],
		patterns: a_patterns,
		short: true,
	}))),

	// {
	// 	selector: 'enum',
	// 	format: ['UPPER_CASE'],
	// 	custom: {
	// 		regex: `^(${S_SNAKE_TYPES_UPPER})_`,
	// 		match: true,
	// 	},
	// },
	{
		selector: 'enum',
		format: ['StrictPascalCase'],
		// custom: {
		// 	regex: `^(${S_SNAKE_TYPES_UPPER})_`,
		// 	match: true,
		// },
	},

	// local function names
	{
		selector: 'variable',
		types: ['function'],
		format: ['snake_case'],
		leadingUnderscore: 'allow',
	},

	// // catch-all for non-primitive parameter types
	// {
	// 	format: ['snake_case'],
	// 	custom: {
	// 		regex: `^_?(${H_PRIMITIVES._other.join('|')})_`,
	// 		match: true,
	// 	},
	// 	selector: 'parameter',
	// },

	// {
	// 	format: ['UPPER_CASE'],
	// 	custom: {
	// 		regex: `^_?(${S_SNAKE_TYPES_UPPER})_`,
	// 		match: true,
	// 	},
	// 	selector: 'parameter',
	// },
];