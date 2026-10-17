/**
 * 默认配置的唯一来源
 *
 * 供 content script / background / options 三处共用，避免默认值漂移。
 * 加载方式与 lib/linkify.js 一致：扩展内为经典脚本，Node 侧可 require。
 */
;(function (root, factory) {
	const api = factory()
	if (typeof module === 'object' && module.exports) {
		module.exports = api
	}
	if (root) {
		Object.assign(root, { SmartLinkifyConfig: api })
	}
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
	'use strict'

	/** @type {Readonly<{openInNewTab: boolean, excludedTags: string[], whitelist: string[], theme: string, lang: string, strictMode: boolean, excludeFileExt: boolean}>} */
	const DEFAULT_CONFIG = {
		openInNewTab: true,
		excludedTags: [
			'SCRIPT',
			'STYLE',
			'NOSCRIPT',
			'TEXTAREA',
			'PRE',
			'CODE',
			'A',
		],
		whitelist: [],
		theme: 'auto',
		lang: 'auto',
		strictMode: true,
		excludeFileExt: true,
	}

	/**
	 * 返回一份可安全修改的默认配置副本
	 * @returns {typeof DEFAULT_CONFIG}
	 */
	function createDefaultConfig() {
		return JSON.parse(JSON.stringify(DEFAULT_CONFIG))
	}

	return { DEFAULT_CONFIG, createDefaultConfig }
})
