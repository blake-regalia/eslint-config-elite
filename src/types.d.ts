
interface PackageConfig {
	rules?: {
		[si_rule: string]: unknown;
	};

	configs?: {};
}

// module 'eslint-plugin-typescript-sort-keys' {
//   const config: PackageConfig;
//   export = config;
// }

module 'eslint-plugin-modules-newline' {
	const config: PackageConfig;
	export = config;
}

module 'eslint-plugin-i' {
	const config: PackageConfig;
	export = config;
}
