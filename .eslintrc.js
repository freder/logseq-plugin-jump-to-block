/* global module */

module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 13,
		sourceType: 'module'
	},
	env: {
		browser: true,
		es2021: true,
		// 'jest/globals': true,
	},
	globals: {
		// React: true,
		// Fragment: true,
	},
	plugins: [
		// 'import',
		'react',
		'react-hooks',
		// 'jsx-a11y',
		'@typescript-eslint',
		// 'jest',
		'functional',
		// 'fp',
		// 'better-mutation',
		// 'prettier',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		// 'plugin:jsx-a11y/recommended',
		// 'plugin:import/recommended',
		// 'plugin:jest/recommended',
		// 'plugin:functional/external-recommended',
		// 'plugin:functional/recommended',
		// 'plugin:functional/stylistic',
	],
	settings: {
		react: {
			version: 'detect'
		},
		'import/resolver': {
			// https://github.com/import-js/eslint-plugin-import#resolvers
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx']
			}
		}
	},
	rules: {
		'indent': ['error', 'tab', { 'SwitchCase': 1 }],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'no-multi-spaces': 'warn',

		// 'no-shadow': 'warn',
		'no-param-reassign': 'error',

		'functional/no-expression-statement': 'off',
		'functional/no-conditional-statement': 'off',
		'functional/no-let': 'off',
		'functional/no-return-void': 'off',
		'functional/no-mixed-type': 'off',
		'functional/immutable-data': 'warn',
		'functional/functional-parameters': 'off',
		'functional/prefer-readonly-type': 'off',
		'@typescript-eslint/prefer-readonly-parameter-types': 'off',
		'functional/prefer-tacit': 'off',
		'functional/immutable-data': 'off',
		'functional/no-try-statement': 'off',

		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',

		'@typescript-eslint/no-unused-vars': 'warn',
		'@typescript-eslint/no-empty-function': 'off',
	}
};
