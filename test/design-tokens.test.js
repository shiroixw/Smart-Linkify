const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')

/**
 * @param {string} file 相对仓库根的路径
 * @returns {string}
 */
function read(file) {
	return fs.readFileSync(path.join(ROOT, file), 'utf8')
}

test('link.css 的链接色与 tokens.css 保持一致', function () {
	const tokens = read('extension/shared/tokens.css')
	const link = read('extension/shared/link.css')

	const tokenColors = [...tokens.matchAll(/--sl-color-link:\s*(#[0-9a-fA-F]{3,6});/g)].map(
		function (m) {
			return m[1].toLowerCase()
		}
	)
	const linkColors = [...link.matchAll(/color:\s*(#[0-9a-fA-F]{3,6});/g)].map(
		function (m) {
			return m[1].toLowerCase()
		}
	)

	assert.equal(tokenColors.length, 2, 'tokens.css 应定义亮色与暗色两个 --sl-color-link')
	assert.equal(linkColors.length, 2, 'link.css 应包含亮色与暗色两条 color 规则')
	assert.equal(linkColors[0], tokenColors[0], '亮色链接色不一致')
	assert.equal(linkColors[1], tokenColors[1], '暗色链接色不一致')
})

test('扩展页面样式不再硬编码颜色', function () {
	const files = [
		'extension/popup.css',
		'extension/options.css',
		'extension/welcome.css',
	]
	files.forEach(function (file) {
		const css = read(file)
		const hardcoded = [...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(function (m) {
			return m[0]
		})
		assert.deepEqual(hardcoded, [], file + ' 存在硬编码颜色：' + hardcoded.join(', '))
	})
})

test('所有扩展页面都引入 token 与主题脚本', function () {
	const pages = [
		'extension/popup.html',
		'extension/options.html',
		'extension/welcome.html',
	]
	pages.forEach(function (page) {
		const html = read(page)
		assert.ok(
			html.includes('shared/tokens.css'),
			page + ' 未引入 shared/tokens.css'
		)
		assert.ok(
			html.includes('shared/theme.js'),
			page + ' 未引入 shared/theme.js'
		)
	})
})

test('主题覆盖只保留 data-theme 一层', function () {
	const files = [
		'extension/popup.css',
		'extension/options.css',
		'extension/welcome.css',
	]
	files.forEach(function (file) {
		const css = read(file)
		assert.ok(
			!css.includes('prefers-color-scheme'),
			file + ' 仍在用 prefers-color-scheme 重复覆盖暗色，应交由 shared/theme.js'
		)
	})
})
