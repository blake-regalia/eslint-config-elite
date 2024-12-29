import {defineConfig} from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
	input: 'src/main.ts',
	output: {
		dir: 'dist',
		format: 'commonjs',
		entryFileNames: '[name].cjs',
		assetFileNames: '[name][extname]',
	},
	plugins: [
		resolve(),

		commonjs({
			include: [
				'eslint-plugin-typescript-sort-keys',
				'eslint-plugin-modules-newline',
				'eslint-plugin-i',
			],
		}),

		typescript({
			include: 'src/**/*.ts',
		}),
	],
});
