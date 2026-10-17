/**
 * DOM 排除规则（纯判断，不修改 DOM）
 *
 * 与 lib/linkify.js 一样同时支持扩展运行时与 Node 测试。
 * 只读取 tagName / isContentEditable / getAttribute / parentElement，
 * 因此测试可以用普通对象模拟。
 */
;(function (root, factory) {
	const api = factory()
	if (typeof module === 'object' && module.exports) {
		module.exports = api
	}
	if (root) {
		root.SmartLinkifyDomRules = api
	}
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
	'use strict'

	// 输入控件类角色：这些区域里的文本属于用户输入，禁止改写
	const EXCLUDED_ROLES = ['textbox', 'searchbox', 'combobox', 'spinbutton']

	/**
	 * 元素自身是否应被排除
	 * @param {{nodeType?: number, tagName?: string, isContentEditable?: boolean, getAttribute?: (name: string) => string | null}} el
	 * @param {string[]} excludedTags
	 * @returns {boolean}
	 */
	function isExcludedElement(el, excludedTags) {
		if (!el) return false
		if (el.nodeType != null && el.nodeType !== 1) return false
		if (excludedTags && el.tagName && excludedTags.indexOf(el.tagName) !== -1) {
			return true
		}
		// contenteditable 及其后代（isContentEditable 会对后代返回 true）
		if (el.isContentEditable) return true
		const role =
			typeof el.getAttribute === 'function' ? el.getAttribute('role') : null
		if (role && EXCLUDED_ROLES.indexOf(role) !== -1) return true
		return false
	}

	/**
	 * 文本节点是否位于被排除的区域（沿父链检查）
	 * @param {{parentElement?: {nodeType?: number, tagName?: string, isContentEditable?: boolean, getAttribute?: (name: string) => string | null, parentElement?: any} | null}} textNode
	 * @param {string[]} excludedTags
	 * @returns {boolean}
	 */
	function isExcludedTextNode(textNode, excludedTags) {
		let parent = textNode && textNode.parentElement
		while (parent) {
			if (isExcludedElement(parent, excludedTags)) return true
			parent = parent.parentElement
		}
		return false
	}

	return { isExcludedElement, isExcludedTextNode, EXCLUDED_ROLES }
})
