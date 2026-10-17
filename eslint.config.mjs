// ESLint 扁平配置（无需额外插件，只启用核心规则）
// 运行：npx eslint .

const BROWSER_GLOBALS = {
	chrome: 'readonly',
	document: 'readonly',
	window: 'readonly',
	navigator: 'readonly',
	localStorage: 'readonly',
	sessionStorage: 'readonly',
	console: 'readonly',
	location: 'readonly',
	history: 'readonly',
	fetch: 'readonly',
	URL: 'readonly',
	URLSearchParams: 'readonly',
	setTimeout: 'readonly',
	clearTimeout: 'readonly',
	setInterval: 'readonly',
	clearInterval: 'readonly',
	requestAnimationFrame: 'readonly',
	MutationObserver: 'readonly',
	IntersectionObserver: 'readonly',
	Node: 'readonly',
	NodeFilter: 'readonly',
	Element: 'readonly',
	HTMLElement: 'readonly',
	Event: 'readonly',
	MouseEvent: 'readonly',
	KeyboardEvent: 'readonly',
	getComputedStyle: 'readonly',
	matchMedia: 'readonly',
	confirm: 'readonly',
	alert: 'readonly',
	globalThis: 'readonly',
	// 经典脚本共享作用域：i18n 由 extension/i18n.js 定义
	i18n: 'readonly',
	// website/js/changelog.js 使用 CDN 加载的 marked
	marked: 'readonly',
	// UMD 包装：lib/*.js 同时在扩展与 Node 中运行
	module: 'readonly',
	exports: 'writable',
	// MV3 service worker 的经典脚本导入
	importScripts: 'readonly',
}

const NODE_GLOBALS = {
	require: 'readonly',
	module: 'writable',
	exports: 'writable',
	__dirname: 'readonly',
	__filename: 'readonly',
	process: 'readonly',
	Buffer: 'readonly',
	console: 'readonly',
	setTimeout: 'readonly',
	clearTimeout: 'readonly',
	URL: 'readonly',
}

export default [
	{
		ignores: ['dist/**', 'node_modules/**', 'website/js/i18n.js'],
	},
	{
		files: ['extension/**/*.js', 'website/js/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'script',
			globals: BROWSER_GLOBALS,
		},
		rules: {
			'no-undef': 'error',
			'no-unused-vars': ['error', { args: 'after-used' }],
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: ['error', 'smart'],
			'no-console': ['warn', { allow: ['error', 'warn', 'info'] }],
			'no-implicit-globals': 'off',
		},
	},
	{
		files: ['scripts/**/*.js', 'test/**/*.js'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
			globals: NODE_GLOBALS,
		},
		rules: {
			'no-undef': 'error',
			'no-unused-vars': ['error', { args: 'after-used' }],
			'no-var': 'error',
			'prefer-const': 'error',
			eqeqeq: ['error', 'smart'],
			'no-console': 'off',
		},
	},
	{
		files: ['eslint.config.mjs'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: NODE_GLOBALS,
		},
	},
]
