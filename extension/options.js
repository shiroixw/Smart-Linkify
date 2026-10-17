// 智能超链接识别 - 设置页面脚本

// 主题初始化由 shared/theme.js 负责（在 <head> 中同步引入）

document.addEventListener('DOMContentLoaded', function () {
	// 初始化国际化
	i18n.init()

	const openInNewTab = document.getElementById('openInNewTab')
	const whitelist = document.getElementById('whitelist')
	const excludedTags = document.getElementById('excludedTags')
	const strictMode = document.getElementById('strictMode')
	const excludeFileExt = document.getElementById('excludeFileExt')
	const saveBtn = document.getElementById('saveBtn')
	const resetBtn = document.getElementById('resetBtn')
	const saveStatus = document.getElementById('saveStatus')
	const themeToggle = document.getElementById('themeToggle')
	const langToggle = document.getElementById('langToggle')
	const themeRadios = document.querySelectorAll('input[name="theme"]')
	const langRadios = document.querySelectorAll('input[name="lang"]')

	// 默认配置唯一来源（与 content / background 共用）
	const defaultConfig = globalThis.SmartLinkifyConfig.createDefaultConfig()

	// 加载配置
	function loadConfig() {
		chrome.storage.sync.get(['config'], function (result) {
			const config = result.config || defaultConfig

			openInNewTab.checked = config.openInNewTab !== false
			whitelist.value = (config.whitelist || []).join('\n')
			excludedTags.value = (
				config.excludedTags || defaultConfig.excludedTags
			).join(', ')
			strictMode.checked = config.strictMode !== false
			excludeFileExt.checked = config.excludeFileExt !== false

			// 加载主题设置
			const theme = config.theme || 'auto'
			const themeRadio = document.getElementById(
				'theme' + theme.charAt(0).toUpperCase() + theme.slice(1)
			)
			if (themeRadio) {
				themeRadio.checked = true
			}
			applyTheme(theme)

			// 加载语言设置
			const lang = config.lang || 'auto'
			let langRadio
			if (lang === 'auto') {
				langRadio = document.getElementById('langAuto')
			} else if (lang === 'zh-CN') {
				langRadio = document.getElementById('langZh')
			} else if (lang === 'en') {
				langRadio = document.getElementById('langEn')
			}
			if (langRadio) {
				langRadio.checked = true
			}
		})
	}

	// 应用主题（auto 由 shared/theme.js 解析为 light / dark 并跟随系统）
	function applyTheme(theme) {
		const themeLib = globalThis.SmartLinkifyTheme
		themeLib.apply(theme)
		themeLib.watch(theme)
	}

	function saveConfig() {
		const whitelistArray = whitelist.value
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0)

		const excludedTagsArray = excludedTags.value
			.split(',')
			.map((tag) => tag.trim().toUpperCase())
			.filter((tag) => tag.length > 0)

		const selectedTheme =
			document.querySelector('input[name="theme"]:checked')?.value ||
			'auto'

		const selectedLang =
			document.querySelector('input[name="lang"]:checked')?.value ||
			'auto'

		chrome.storage.sync.get(['config'], function (result) {
			const config = result.config || {}

			config.openInNewTab = openInNewTab.checked
			config.whitelist = whitelistArray
			config.excludedTags =
				excludedTagsArray.length > 0
					? excludedTagsArray
					: defaultConfig.excludedTags
			config.theme = selectedTheme
			config.lang = selectedLang
			config.strictMode = strictMode.checked
			config.excludeFileExt = excludeFileExt.checked

			chrome.storage.sync.set({ config: config }, function () {
				showStatus(i18n.t('options.status.saved'), 'success')
			})
		})
	}

	// 重置为默认配置
	function resetConfig() {
		if (confirm(i18n.t('options.confirm.reset'))) {
			chrome.storage.sync.set({ config: defaultConfig }, function () {
				loadConfig()
				showStatus(i18n.t('options.status.reset'), 'success')
			})
		}
	}

	// 显示保存状态
	function showStatus(message, type) {
		saveStatus.textContent = message
		saveStatus.className = 'save-status show ' + type

		setTimeout(function () {
			saveStatus.classList.remove('show')
		}, 3000)
	}

	// 事件监听
	saveBtn.addEventListener('click', saveConfig)
	resetBtn.addEventListener('click', resetConfig)

	// 主题切换按钮事件
	themeToggle.addEventListener('click', function () {
		const current = globalThis.SmartLinkifyTheme.resolve(
			document.documentElement.getAttribute('data-theme')
		)
		const newTheme = current === 'dark' ? 'light' : 'dark'
		applyTheme(newTheme)

		// 更新单选按钮状态
		const themeRadio = document.getElementById(
			'theme' + newTheme.charAt(0).toUpperCase() + newTheme.slice(1)
		)
		if (themeRadio) {
			themeRadio.checked = true
		}

		// 保存主题设置
		chrome.storage.sync.get(['config'], function (result) {
			const config = result.config || {}
			config.theme = newTheme
			chrome.storage.sync.set({ config: config })
		})
	})

	// 主题单选按钮事件
	themeRadios.forEach(function (radio) {
		radio.addEventListener('change', function () {
			const theme = this.value
			applyTheme(theme)

			// 保存主题设置
			chrome.storage.sync.get(['config'], function (result) {
				const config = result.config || {}
				config.theme = theme
				chrome.storage.sync.set({ config: config })
			})
		})
	})

	// 语言单选按钮事件
	langRadios.forEach(function (radio) {
		radio.addEventListener('change', function () {
			const lang = this.value
			i18n.setLang(lang)
		})
	})

	// 语言切换按钮事件
	langToggle.addEventListener('click', function () {
		i18n.toggle()
		// 更新单选按钮状态
		const currentLang = i18n.currentLang
		let langRadio
		if (currentLang === 'zh-CN') {
			langRadio = document.getElementById('langZh')
		} else if (currentLang === 'en') {
			langRadio = document.getElementById('langEn')
		}
		if (langRadio) {
			langRadio.checked = true
		}
	})

	// 初始化
	loadConfig()
})
