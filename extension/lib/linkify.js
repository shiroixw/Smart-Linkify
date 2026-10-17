/**
 * 链接识别核心（纯函数，无 DOM 依赖）
 *
 * 同时支持两种加载方式：
 * - 扩展运行时：以经典脚本注入 `content_scripts`，API 挂在 `globalThis.SmartLinkify`
 * - Node 测试：`require('./linkify.js')`
 */
;(function (root, factory) {
	const api = factory()
	if (typeof module === 'object' && module.exports) {
		module.exports = api
	}
	if (root) {
		Object.assign(root, { SmartLinkify: api })
	}
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
	'use strict'

	// URL 主体字符集：只收 RFC 3986 的 ASCII 集合
	// （中文正文紧贴在 URL 后面时不会被误吞，如 "访问https://a.com了解详情"）
	const URL_BODY = '[\\w\\-.~:/#\\[\\]@!$&()*+,;=%]*'
	// ? 之后是 query，放宽到"非空白非引号"，
	// 保证 ?q=中文 这类参数不会被截断（"?" 因此从上面集合中移除）
	const URL_QUERY = '(?:\\?[^\\s<>"\'`]*)?'

	// 带协议的 URL：https:// http:// ftp://
	const SCHEME_URL_RE = new RegExp(
		'\\b(?:https?|ftp):\\/\\/' + URL_BODY + URL_QUERY,
		'gi'
	)

	// 显式 www. 前缀的裸域名
	const WWW_URL_RE = new RegExp('\\bwww\\.' + URL_BODY + URL_QUERY, 'gi')

	// 裸域名：example.com、example.com/path、sub.domain.co.uk
	// 末段必须是字母 TLD（>=2 位），天然排除 1.2.3 / 13804.46 / 192.168.1.1
	// 前置 lookbehind 排除 email 局部、相对路径、已匹配 URL 的中间片段
	const BARE_DOMAIN_RE = new RegExp(
		'(?<![\\w@./:%-])(?:[a-z0-9][a-z0-9-]*\\.)+[a-z]{2,24}(?::\\d{1,5})?' +
			URL_BODY +
			URL_QUERY,
		'gi'
	)

	// 邮箱
	const EMAIL_RE = /[a-z0-9._%+-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,24}/gi

	// 尾部需要剥离的标点（中英文）
	const TRAILING_PUNCT_RE = /[.,;:!?'"`。，、；：！？…·》」』】〉》]$/
	/** @type {Record<string, string>} */
	const CLOSERS = { ')': '(', ']': '[', '}': '{' }

	// 常见"文件后缀"而非 TLD，用于严格模式下排除 config.json / app.js 之类
	const FILE_EXT_RE =
		/\.(?:js|mjs|cjs|css|json|xml|yaml|yml|md|txt|log|map|ts|tsx|jsx|vue|py|java|cpp|cs|h|go|rs|php|rb|sh|bat|exe|dll|so|dylib|png|jpe?g|gif|svg|webp|ico|bmp|mp3|mp4|mov|avi|wav|flac|zip|rar|7z|gz|tar|pdf|docx?|xlsx?|pptx?)$/i

	/**
	 * 剥离 URL 尾部的标点（句号、逗号、引号、配对的右括号等）
	 * @param {string} raw
	 * @returns {string}
	 */
	function trimTrailing(raw) {
		let out = raw
		for (;;) {
			const last = out[out.length - 1]
			if (!last) break
			if (TRAILING_PUNCT_RE.test(last)) {
				out = out.slice(0, -1)
				continue
			}
			const opener = CLOSERS[last]
			if (opener) {
				const opens = countChar(out, opener)
				const closes = countChar(out, last)
				// 仅在括号不配对时剥离，保留维基百科那类 (...) 收尾链接
				if (closes > opens) {
					out = out.slice(0, -1)
					continue
				}
			}
			break
		}
		return out
	}

	/**
	 * @param {string} str
	 * @param {string} ch
	 * @returns {number}
	 */
	function countChar(str, ch) {
		let n = 0
		for (let i = 0; i < str.length; i++) {
			if (str[i] === ch) n++
		}
		return n
	}

	/**
	 * 是否为纯数字 / 数字点串（13804.46、1.2.3.4）
	 * @param {string} value
	 * @returns {boolean}
	 */
	function isNumericOnly(value) {
		return /^\d+(?:\.\d+)+$/.test(value)
	}

	/**
	 * @param {string} value
	 * @returns {boolean}
	 */
	function isFileExtension(value) {
		return FILE_EXT_RE.test(value)
	}

	/**
	 * 严格模式下过滤误匹配
	 * @param {string} value 已 trim 的匹配文本
	 * @param {{strictMode?: boolean, excludeFileExt?: boolean}} [options]
	 * @returns {boolean}
	 */
	function isValidUrl(value, options) {
		const opts = options || {}
		const strict = opts.strictMode !== false
		if (!value) return false
		// 版本号 / 统计数字一律排除，即使关闭严格模式也没有意义
		if (isNumericOnly(value)) return false
		if (!strict) return true
		if (!/[a-z]/i.test(value)) return false
		if (opts.excludeFileExt !== false && isFileExtension(value)) return false
		return true
	}

	/**
	 * 生成 href：无协议补 http://，邮箱补 mailto:
	 * @param {string} text
	 * @param {'url'|'email'} type
	 * @returns {string}
	 */
	function buildHref(text, type) {
		if (type === 'email') return 'mailto:' + text
		// 任何已有 scheme（http/https/ftp/mailto/…）都原样保留，避免二次加前缀
		if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return text
		return 'http://' + text
	}

	/**
	 * 在纯文本中找出所有 URL / 邮箱
	 * @param {string} text
	 * @param {{strictMode?: boolean, excludeFileExt?: boolean}} [options]
	 * @returns {Array<{index: number, length: number, text: string, type: 'url'|'email', href: string}>}
	 */
	function findLinks(text, options) {
		if (!text || !text.trim()) return []

		/** @type {Array<{index: number, length: number, text: string, type: 'url'|'email', href: string}>} */
		const candidates = []

		/**
		 * @param {RegExp} re
		 * @param {'url' | 'email'} type
		 */
		const collect = (re, type) => {
			re.lastIndex = 0
			let match
			while ((match = re.exec(text)) !== null) {
				const raw = trimTrailing(match[0])
				if (!raw) continue
				if (type === 'url' && !isValidUrl(raw, options)) continue
				candidates.push({
					index: match.index,
					length: raw.length,
					text: raw,
					type,
					href: buildHref(raw, type),
				})
				// 防御零宽匹配死循环
				if (match.index === re.lastIndex) re.lastIndex++
			}
		}

		// 邮箱先收集，保证与裸域名重叠时优先保留邮箱
		collect(EMAIL_RE, 'email')
		collect(SCHEME_URL_RE, 'url')
		collect(WWW_URL_RE, 'url')
		collect(BARE_DOMAIN_RE, 'url')

		candidates.sort(function (a, b) {
			if (a.index !== b.index) return a.index - b.index
			return b.length - a.length
		})

		/** @type {typeof candidates} */
		const result = []
		let lastEnd = -1
		for (const item of candidates) {
			if (item.index < lastEnd) continue
			result.push(item)
			lastEnd = item.index + item.length
		}
		return result
	}

	return {
		findLinks,
		buildHref,
		isValidUrl,
		trimTrailing,
		SCHEME_URL_RE,
		WWW_URL_RE,
		BARE_DOMAIN_RE,
		EMAIL_RE,
	}
})
