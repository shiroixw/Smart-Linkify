/*
 * 主题解析（扩展 UI 的唯一入口）
 *
 * 设计：
 * - CSS 只在 [data-theme='dark'] 下覆盖 token，不再写 @media 重复块
 * - 'auto' 由这里解析成 light / dark，并跟随系统变化
 * - 页面在 <head> 里同步引入本文件，先用系统偏好上色，读到 storage 后再修正
 */
;(function (root) {
	'use strict'

	const MEDIA = '(prefers-color-scheme: dark)'
	/** @type {MediaQueryList | null} */
	let watcher = null

	/**
	 * @param {string} [theme] 'auto' | 'light' | 'dark'
	 * @returns {'light' | 'dark'}
	 */
	function resolve(theme) {
		if (theme === 'light' || theme === 'dark') return theme
		return root.matchMedia && root.matchMedia(MEDIA).matches ? 'dark' : 'light'
	}

	/**
	 * @param {string} [theme]
	 */
	function apply(theme) {
		document.documentElement.setAttribute('data-theme', resolve(theme))
	}

	function onSystemChange() {
		apply('auto')
	}

	/**
	 * 只在 'auto' 时监听系统主题变化
	 * @param {string} [theme]
	 */
	function watch(theme) {
		if (watcher) {
			watcher.removeEventListener('change', onSystemChange)
			watcher = null
		}
		if (theme === 'light' || theme === 'dark') return
		if (!root.matchMedia) return
		watcher = root.matchMedia(MEDIA)
		watcher.addEventListener('change', onSystemChange)
	}

	/**
	 * @param {(theme: string) => void} [done]
	 */
	function init(done) {
		// 先用系统偏好兜底，避免白屏闪烁
		apply('auto')
		chrome.storage.sync.get(['config'], function (result) {
			const theme = (result && result.config && result.config.theme) || 'auto'
			apply(theme)
			watch(theme)
			if (typeof done === 'function') done(theme)
		})
	}

	root.SmartLinkifyTheme = { resolve, apply, watch, init }

	// 引入即生效（各扩展页面都在 <head> 中引用）
	if (typeof chrome !== 'undefined' && chrome.storage) {
		init()
	}
})(typeof globalThis !== 'undefined' ? globalThis : this)
