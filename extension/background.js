// 智能超链接识别 - 后台脚本

// 默认配置唯一来源（与 content / options 共用）
importScripts('lib/config.js')

const defaultConfig = globalThis.SmartLinkifyConfig.createDefaultConfig()

// 安装或更新时的处理
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === 'install') {
		chrome.storage.sync.set({ config: defaultConfig }, () => {
			console.info('智能超链接识别插件已安装，默认配置已保存')
		})
		chrome.tabs.create({ url: 'welcome.html' })
	} else if (details.reason === 'update') {
		// 迁移旧配置：移除 enabled/blacklist，确保 whitelist 存在
		chrome.storage.sync.get(['config'], (result) => {
			const config = result.config
			if (!config) return

			let needsSave = false
			if ('enabled' in config) {
				delete config.enabled
				needsSave = true
			}
			if ('blacklist' in config) {
				delete config.blacklist
				needsSave = true
			}
			if (!Array.isArray(config.whitelist)) {
				config.whitelist = []
				needsSave = true
			}
			if (needsSave) {
				chrome.storage.sync.set({ config })
			}
		})
	}
})

// 监听来自 content script / popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getConfig') {
		chrome.storage.sync.get(['config'], (result) => {
			sendResponse({ config: result.config })
		})
		return true
	}

	if (request.action === 'toggleWhitelist') {
		const { domain } = request
		chrome.storage.sync.get(['config'], (result) => {
			const config = result.config || { ...defaultConfig }
			const list = config.whitelist || []
			const exactIndex = list.findIndex((d) => d === domain)
			const matchIndex = exactIndex >= 0
				? exactIndex
				: list.findIndex((d) => domain.endsWith('.' + d))

			if (matchIndex >= 0) {
				list.splice(matchIndex, 1)
			} else {
				list.push(domain)
			}
			config.whitelist = list
			chrome.storage.sync.set({ config }, () => {
				sendResponse({ whitelisted: matchIndex < 0, whitelist: list })
			})
		})
		return true
	}

	if (request.action === 'updateLinkCount') {
		const tabId = sender.tab?.id
		if (tabId) {
			const count = request.count || 0
			const text = count > 0 ? String(count) : ''
			chrome.action.setBadgeText({ text, tabId })
			chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId })
		}
	}
})

// 重置标签页徽章（content script 上报计数后会重新设置）
function updateBadgeForTab(tabId) {
	chrome.action.setBadgeText({ text: '', tabId })
}

// 标签页切换/更新时刷新徽章
chrome.tabs.onActivated.addListener(({ tabId }) => {
	updateBadgeForTab(tabId)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	if (changeInfo.status === 'loading') {
		updateBadgeForTab(tabId)
	}
})
