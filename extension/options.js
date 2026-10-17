// 智能超链接识别 - 设置页面脚本

// 初始化主题（立即执行，避免闪烁）
;(function () {
	chrome.storage.sync.get(['config'], function (result) {
		const config = result.config || {}
		// 默认跟随系统（auto），不设置 data-theme 属性
		const theme = config.theme
		if (theme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'dark')
		} else if (theme === 'light') {
			document.documentElement.setAttribute('data-theme', 'light')
		}
		// theme 为 undefined 或 'auto' 时不设置属性，跟随系统
	})
})()

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

	// 应用主题
	function applyTheme(theme) {
		if (theme === 'auto') {
			document.documentElement.removeAttribute('data-theme')
		} else {
			document.documentElement.setAttribute('data-theme', theme)
		}
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
		const currentTheme = document.documentElement.getAttribute('data-theme')
		const isDark =
			currentTheme === 'dark' ||
			(!currentTheme &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)

		const newTheme = isDark ? 'light' : 'dark'
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
