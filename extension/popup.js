// 智能超链接识别 - 弹出窗口脚本

// 内容脚本无法（或不应）在这些页面生效
const BLOCKED_PROTOCOLS = [
	'chrome:',
	'chrome-extension:',
	'chrome-untrusted:',
	'edge:',
	'about:',
	'brave:',
	'file:',
	'devtools:',
	'view-source:',
	'moz-extension:',
]

// 初始化主题（立即执行，避免闪烁）
;(function () {
	chrome.storage.sync.get(['config'], function (result) {
		const config = result.config || {}
		const theme = config.theme
		if (theme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark')
		} else if (theme === 'light') {
			document.documentElement.setAttribute('data-theme', 'light')
		}
	})
})()

document.addEventListener('DOMContentLoaded', function () {
	i18n.init()

	const siteToggle = document.getElementById('siteToggle')
	const statusText = document.getElementById('statusText')
	const currentDomainEl = document.getElementById('currentDomain')
	const linkCountEl = document.getElementById('linkCount')
	const linkCountCard = document.getElementById('linkCountCard')
	const statsGrid = document.getElementById('statsGrid')
	const infoActive = document.getElementById('infoActive')
	const infoInactive = document.getElementById('infoInactive')
	const infoUnsupported = document.getElementById('infoUnsupported')
	const optionsBtn = document.getElementById('optionsBtn')
	const refreshBtn = document.getElementById('refreshBtn')
	const themeToggle = document.getElementById('themeToggle')
	const langToggle = document.getElementById('langToggle')
	const versionText = document.getElementById('versionText')

	const manifest = chrome.runtime.getManifest()
	versionText.textContent = 'v' + manifest.version

	let currentHostname = ''

	// 获取当前标签页信息并初始化 UI
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (!tabs[0] || !tabs[0].url) return

		let parsedUrl
		try {
			parsedUrl = new URL(tabs[0].url)
		} catch {
			showUnsupported()
			return
		}

		if (BLOCKED_PROTOCOLS.indexOf(parsedUrl.protocol) !== -1) {
			showUnsupported()
			return
		}

		currentHostname = parsedUrl.hostname
		currentDomainEl.textContent = currentHostname

		// 检查当前站点是否在白名单中
		chrome.storage.sync.get(['config'], function (result) {
			const config = result.config || {}
			const whitelist = config.whitelist || []
			const isWhitelisted = whitelist.some(function (d) {
				return currentHostname === d || currentHostname.endsWith('.' + d)
			})

			siteToggle.checked = isWhitelisted
			updateUI(isWhitelisted)

			if (isWhitelisted) {
				fetchLinkCount(tabs[0].id)
			}
		})
	})

	// per-site 开关
	siteToggle.addEventListener('change', function () {
		if (!currentHostname) return

		chrome.runtime.sendMessage(
			{ action: 'toggleWhitelist', domain: currentHostname },
			function (response) {
				if (!response) return
				updateUI(response.whitelisted)

				chrome.tabs.query(
					{ active: true, currentWindow: true },
					function (tabs) {
						if (tabs[0]) {
							chrome.tabs.reload(tabs[0].id)
						}
					}
				)
			}
		)
	})

	// 打开设置页面
	optionsBtn.addEventListener('click', function () {
		chrome.runtime.openOptionsPage()
	})

	// 刷新当前页面
	refreshBtn.addEventListener('click', function () {
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				if (tabs[0]) {
					chrome.tabs.reload(tabs[0].id)
					window.close()
				}
			}
		)
	})

	function fetchLinkCount(tabId) {
		chrome.tabs.sendMessage(
			tabId,
			{ action: 'getLinkCount' },
			function (response) {
				if (chrome.runtime.lastError || !response) {
					linkCountEl.textContent = '0'
					return
				}
				linkCountEl.textContent = String(response.count || 0)
			}
		)
	}

	function updateUI(whitelisted) {
		if (whitelisted) {
			statusText.textContent = i18n.t('popup.status.enabled')
			statusText.style.color = '#4CAF50'
			statsGrid.style.display = ''
			infoActive.style.display = ''
			infoInactive.style.display = 'none'
			infoUnsupported.style.display = 'none'
			linkCountCard.classList.remove('disabled')
		} else {
			statusText.textContent = i18n.t('popup.status.disabled')
			statusText.style.color = '#F44336'
			statsGrid.style.display = 'none'
			infoActive.style.display = 'none'
			infoInactive.style.display = ''
			infoUnsupported.style.display = 'none'
			linkCountEl.textContent = '—'
		}
	}

	function showUnsupported() {
		currentDomainEl.textContent = '—'
		siteToggle.disabled = true
		statusText.textContent = i18n.t('popup.status.unsupported')
		statusText.style.color = '#999'
		statsGrid.style.display = 'none'
		infoActive.style.display = 'none'
		infoInactive.style.display = 'none'
		infoUnsupported.style.display = ''
	}

	// 主题切换
	themeToggle.addEventListener('click', function () {
		chrome.storage.sync.get(['config'], function (result) {
			const config = result.config || {}
			const currentTheme =
				document.documentElement.getAttribute('data-theme')
			const isDark =
				currentTheme === 'dark' ||
				(!currentTheme &&
					window.matchMedia('(prefers-color-scheme: dark)').matches)

			const newTheme = isDark ? 'light' : 'dark'
			document.documentElement.setAttribute('data-theme', newTheme)
			config.theme = newTheme
			chrome.storage.sync.set({ config: config })
		})
	})

	// 语言切换
	langToggle.addEventListener('click', function () {
		i18n.toggle()
		// 重新应用 UI 状态文本
		if (siteToggle.disabled) {
			statusText.textContent = i18n.t('popup.status.unsupported')
		} else {
			updateUI(siteToggle.checked)
		}
	})
})
