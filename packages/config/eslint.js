import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const restrictedImports = (patterns) => [
	'error',
	{
		patterns: patterns.map((group) => ({
			group: [group, `${group}/*`],
			message: `Import ${group} tidak diizinkan di paket ini (lihat docs/03-arsitektur-teknis.md §3).`
		}))
	}
];

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			'**/node_modules/**',
			'**/.svelte-kit/**',
			'**/build/**',
			'**/dist/**',
			'**/coverage/**',
			'**/playwright-report/**',
			'**/test-results/**'
		]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: { ...globals.node, ...globals.browser }
		},
		rules: {
			'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
			'no-undef': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }
			]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: { parser: tseslint.parser }
		}
	},
	{
		files: ['apps/web/**/*.{ts,svelte}', 'apps/admin/**/*.{ts,svelte}'],
		rules: { 'no-restricted-imports': restrictedImports(['@azetta/db', '@azetta/api']) }
	},
	{
		files: ['apps/api/**/*.ts'],
		rules: {
			'no-restricted-imports': restrictedImports(['@azetta/ui', '@azetta/web', '@azetta/admin'])
		}
	},
	{
		files: ['packages/db/**/*.ts'],
		rules: {
			'no-restricted-imports': restrictedImports([
				'@azetta/ui',
				'@azetta/web',
				'@azetta/admin',
				'@azetta/api'
			])
		}
	},
	{
		files: ['packages/ui/**/*.{ts,svelte}'],
		rules: { 'no-restricted-imports': restrictedImports(['@azetta/db', '@azetta/api']) }
	},
	...svelte.configs.prettier,
	prettier
];
