const test = require('node:test')
const assert = require('node:assert/strict')

const linkify = require('../extension/lib/linkify.js')
const { findLinks, buildHref, isValidUrl, trimTrailing } = linkify

/**
 * @param {string} text
 * @returns {string[]}
 */
function texts(text) {
	return findLinks(text).map(function (m) {
		return m.text
	})
}

test('带协议的常见 URL 可识别', function () {
	assert.deepEqual(texts('A https://example.com'), ['https://example.com'])
	assert.deepEqual(texts('B https://github.com/user/project'), [
		'https://github.com/user/project',
	])
	assert.deepEqual(texts('C http://example.com/a?b=1&c=2'), [
		'http://example.com/a?b=1&c=2',
	])
	assert.deepEqual(texts('D ftp://files.example.com/x'), [
		'ftp://files.example.com/x',
	])
})

test('裸域名与 www 前缀可识别', function () {
	assert.deepEqual(texts('E www.example.com'), ['www.example.com'])
	assert.deepEqual(texts('F example.com'), ['example.com'])
	assert.deepEqual(texts('G example.com/page'), ['example.com/page'])
	assert.deepEqual(texts('H sub.domain.co.uk/path?x=1'), [
		'sub.domain.co.uk/path?x=1',
	])
	assert.deepEqual(texts('I www.google.com'), ['www.google.com'])
})

test('邮箱可识别且不与其域名部分重复', function () {
	const found = findLinks('联系 contact@example.com 谢谢')
	assert.equal(found.length, 1)
	assert.equal(found[0].type, 'email')
	assert.equal(found[0].text, 'contact@example.com')
	assert.equal(found[0].href, 'mailto:contact@example.com')
})

test('一段文本中的多个链接按位置排序', function () {
	const found = findLinks('看 www.a.com 和 https://b.com/x 还有 c.org')
	assert.deepEqual(
		found.map(function (m) {
			return m.text
		}),
		['www.a.com', 'https://b.com/x', 'c.org']
	)
})

test('URL 内嵌邮箱时只保留整体 URL', function () {
	const found = findLinks('https://user@example.com/x')
	assert.equal(found.length, 1)
	assert.equal(found[0].text, 'https://user@example.com/x')
})

test('中文紧贴不影响识别', function () {
	assert.deepEqual(texts('访问https://www.github.com了解详情'), [
		'https://www.github.com',
	])
	assert.deepEqual(texts('访问example.com了解详情'), ['example.com'])
	assert.deepEqual(texts('见 www.github.com。'), ['www.github.com'])
})

test('尾部标点被剥离', function () {
	assert.deepEqual(texts('Visit https://www.github.com/a.'), [
		'https://www.github.com/a',
	])
	assert.deepEqual(texts('(https://www.github.com)'), [
		'https://www.github.com',
	])
	assert.deepEqual(texts('"example.com"'), ['example.com'])
	assert.equal(trimTrailing('https://a.com/x,'), 'https://a.com/x')
})

test('括号配对时保留右括号', function () {
	assert.deepEqual(texts('https://en.wikipedia.org/wiki/Foo_(bar)'), [
		'https://en.wikipedia.org/wiki/Foo_(bar)',
	])
})

test('中文查询参数不会被截断', function () {
	assert.deepEqual(texts('https://www.github.com/path?q=中文'), [
		'https://www.github.com/path?q=中文',
	])
})

test('端口号可识别', function () {
	assert.deepEqual(texts('http://localhost:8080/app'), [
		'http://localhost:8080/app',
	])
})

test('必须排除的误匹配', function () {
	const negatives = [
		'版本号 1.0.0.290',
		'统计值 13804.46',
		'IP 192.168.1.1',
		'脚本 app.js 与配置 config.json',
		'样式 style.css',
		'纯数字 12345',
	]
	negatives.forEach(function (text) {
		assert.deepEqual(texts(text), [], text)
	})
})

test('大写下划线的邮箱也可识别', function () {
	assert.deepEqual(texts('MAIL: Foo_Bar+Baz@Example.COM'), [
		'Foo_Bar+Baz@Example.COM',
	])
})

test('buildHref 保留已有 scheme，只给裸域名补 http', function () {
	assert.equal(buildHref('example.com', 'url'), 'http://example.com')
	assert.equal(buildHref('www.example.com', 'url'), 'http://www.example.com')
	assert.equal(buildHref('https://a.com', 'url'), 'https://a.com')
	assert.equal(buildHref('http://a.com', 'url'), 'http://a.com')
	assert.equal(buildHref('ftp://a.com', 'url'), 'ftp://a.com')
	assert.equal(buildHref('mailto:a@b.com', 'url'), 'mailto:a@b.com')
	assert.equal(buildHref('a@b.com', 'email'), 'mailto:a@b.com')
})

test('isValidUrl 受 strictMode / excludeFileExt 控制', function () {
	assert.equal(isValidUrl('config.json'), false)
	assert.equal(isValidUrl('config.json', { excludeFileExt: false }), true)
	assert.equal(isValidUrl('1.2.3'), false)
	assert.equal(isValidUrl('1.2.3', { strictMode: false }), false)
	assert.equal(isValidUrl('example.com'), true)
})

test('关闭严格模式后仍可识别裸域名', function () {
	const found = findLinks('see example.com', { strictMode: false })
	assert.equal(found.length, 1)
	assert.equal(found[0].href, 'http://example.com')
})

test('空文本与无链接文本返回空数组', function () {
	assert.deepEqual(findLinks(''), [])
	assert.deepEqual(findLinks('   '), [])
	assert.deepEqual(findLinks('这里没有任何网址'), [])
})
