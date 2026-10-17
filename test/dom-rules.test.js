const test = require('node:test')
const assert = require('node:assert/strict')

const {
	isExcludedElement,
	isExcludedTextNode,
} = require('../extension/lib/dom-rules.js')

const DEFAULT_TAGS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'PRE', 'CODE', 'A']

/**
 * 构造一个足够像 DOM 元素的普通对象
 * @param {string} tagName
 * @param {{editable?: boolean, role?: string, parent?: any}} [opts]
 */
function el(tagName, opts) {
	const options = opts || {}
	return {
		nodeType: 1,
		tagName,
		isContentEditable: options.editable === true,
		parentElement: options.parent || null,
		getAttribute: function (name) {
			if (name === 'role' && options.role) return options.role
			return null
		},
	}
}

/**
 * @param {any} parentElement
 */
function textNode(parentElement) {
	return { nodeType: 3, parentElement }
}

test('按标签名排除', function () {
	DEFAULT_TAGS.forEach(function (tag) {
		assert.equal(isExcludedElement(el(tag), DEFAULT_TAGS), true, tag)
	})
	assert.equal(isExcludedElement(el('P'), DEFAULT_TAGS), false)
	assert.equal(isExcludedElement(el('DIV'), DEFAULT_TAGS), false)
})

test('contenteditable 区域被排除', function () {
	assert.equal(isExcludedElement(el('DIV', { editable: true }), DEFAULT_TAGS), true)
	assert.equal(isExcludedElement(el('DIV'), DEFAULT_TAGS), false)
})

test('输入类 role 被排除', function () {
	;['textbox', 'searchbox', 'combobox', 'spinbutton'].forEach(function (role) {
		assert.equal(
			isExcludedElement(el('DIV', { role: role }), DEFAULT_TAGS),
			true,
			role
		)
	})
	assert.equal(isExcludedElement(el('DIV', { role: 'button' }), DEFAULT_TAGS), false)
})

test('文本节点沿父链判断', function () {
	const editable = el('DIV', { editable: true })
	const inner = el('SPAN', { parent: editable })
	// 模拟 isContentEditable 对后代的传播
	inner.isContentEditable = true

	assert.equal(isExcludedTextNode(textNode(inner), DEFAULT_TAGS), true)
	assert.equal(isExcludedTextNode(textNode(el('P')), DEFAULT_TAGS), false)
})

test('代码块内的文本节点被排除', function () {
	const pre = el('PRE')
	const code = el('CODE', { parent: pre })
	assert.equal(isExcludedTextNode(textNode(code), DEFAULT_TAGS), true)
})

test('没有 getAttribute 的对象不会抛错', function () {
	assert.equal(
		isExcludedElement({ nodeType: 1, tagName: 'DIV' }, DEFAULT_TAGS),
		false
	)
})

test('空值与非法输入安全返回 false', function () {
	assert.equal(isExcludedElement(null, DEFAULT_TAGS), false)
	assert.equal(isExcludedTextNode({}, DEFAULT_TAGS), false)
	assert.equal(isExcludedElement(el('P'), []), false)
})
