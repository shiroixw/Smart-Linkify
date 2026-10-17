// 智能超链接识别 - 内容脚本
;(function () {
	'use strict'

	const Linkify = globalThis.SmartLinkify
	const configLib = globalThis.SmartLinkifyConfig

	// lib 依赖缺失时明确报错，避免"静默全站不生效"
	if (!Linkify || !configLib) {
		console.error('[Smart Linkify] lib 未加载，内容脚本已停用')
		return
	}

	// 默认配置与 background / options 共用同一来源
	let config = configLib.createDefaultConfig()

	let convertedCount = 0
	let sendCountTimer = null

	function sendLinkCount() {
		chrome.runtime.sendMessage({
			action: 'updateLinkCount',
			count: convertedCount,
		})
	}

	function scheduleSendLinkCount() {
		clearTimeout(sendCountTimer)
		sendCountTimer = setTimeout(sendLinkCount, 300)
	}

	// 标记已处理的节点
	const PROCESSED_ATTR = 'data-link-converted'

	// 从存储加载配置
	function loadConfig() {
		chrome.storage.sync.get(['config'], function (result) {
			if (result.config) {
				config = { ...config, ...result.config }
			}
			if (isWhitelisted()) {
				init()
			}
		})
	}

	// 检查当前网站是否在白名单中
	function isWhitelisted() {
		const hostname = window.location.hostname
		return (config.whitelist || []).some((domain) => hostname === domain || hostname.endsWith('.' + domain))
	}

	// 初始化
	function init() {
		processNode(document.body)
		sendLinkCount()
		observeDOMChanges()
	}

	// 处理节点
	function processNode(node) {
		if (!node || node.nodeType !== Node.ELEMENT_NODE) {
			return
		}

		// 跳过已处理或排除的标签
		if (
			node.hasAttribute(PROCESSED_ATTR) ||
			config.excludedTags.includes(node.tagName)
		) {
			return
		}

		// 标记为已处理
		node.setAttribute(PROCESSED_ATTR, 'true')

		// 遍历子节点
		const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
			acceptNode: function (node) {
				// 检查父节点是否应该被排除
				let parent = node.parentElement
				while (parent) {
					if (config.excludedTags.includes(parent.tagName)) {
						return NodeFilter.FILTER_REJECT
					}
					parent = parent.parentElement
				}
				return NodeFilter.FILTER_ACCEPT
			},
		})

		const textNodes = []
		let currentNode
		while ((currentNode = walker.nextNode())) {
			textNodes.push(currentNode)
		}

		// 处理文本节点
		textNodes.forEach((textNode) => {
			convertTextToLinks(textNode)
		})
	}

	// 将文本转换为链接
	function convertTextToLinks(textNode) {
		const text = textNode.textContent
		if (!text || !text.trim()) {
			return
		}

		// 识别与去重都在 lib 内完成
		const uniqueMatches = Linkify.findLinks(text, {
			strictMode: config.strictMode,
			excludeFileExt: config.excludeFileExt,
		})

		if (uniqueMatches.length === 0) {
			return
		}

		const fragment = document.createDocumentFragment()
		let lastIndex = 0

		// 构建新的 DOM 结构
		uniqueMatches.forEach((match) => {
			// 添加匹配前的文本
			if (match.index > lastIndex) {
				fragment.appendChild(
					document.createTextNode(
						text.substring(lastIndex, match.index)
					)
				)
			}

			// 创建链接
			const link = document.createElement('a')
			link.textContent = match.text
			link.href = match.href

			if (config.openInNewTab) {
				link.target = '_blank'
				link.rel = 'noopener noreferrer'
			}

			link.style.color = '#0066cc'
			link.style.textDecoration = 'underline'
			link.setAttribute('data-auto-link', 'true')

			fragment.appendChild(link)
			lastIndex = match.index + match.length
		})

		// 添加剩余文本
		if (lastIndex < text.length) {
			fragment.appendChild(
				document.createTextNode(text.substring(lastIndex))
			)
		}

		convertedCount += uniqueMatches.length
		textNode.parentNode.replaceChild(fragment, textNode)
	}

	// 监听 DOM 变化
	function observeDOMChanges() {
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				mutation.addedNodes.forEach(function (node) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						processNode(node)
					}
				})
			})
			scheduleSendLinkCount()
		})

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		})
	}

	// 监听来自 popup 的消息
	chrome.runtime.onMessage.addListener(function (
		request,
		sender,
		sendResponse
	) {
		if (request.action === 'getStatus') {
			sendResponse({ active: isWhitelisted() })
		} else if (request.action === 'getLinkCount') {
			sendResponse({ count: convertedCount })
		}
	})

	// 启动
	loadConfig()
})()
