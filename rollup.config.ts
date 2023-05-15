import {defineConfig} from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

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

		typescript({
			include: 'src/**/*.ts',
		}),
	],
});
